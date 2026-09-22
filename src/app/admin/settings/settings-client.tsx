'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Store, 
  Sparkles, 
  Megaphone, 
  Truck, 
  CreditCard, 
  PhoneCall, 
  Share2, 
  Gift, 
  ShieldCheck, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Sliders,
  Layers,
  Info,
  ChevronLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { updateStoreSettings } from '@/app/actions/admin/settings'
import { cn } from '@/lib/utils'

export interface SettingsData {
  // 1. General & Identity
  storeName: string
  storeSlogan: string
  storeDescription: string
  currency: string
  logoUrl?: string | null
  faviconUrl?: string | null
  maintenanceMode: boolean
  maintenanceMessage: string

  // 2. Announcement & Header
  showTopBar: boolean
  topBarText: string
  topBarLink?: string | null
  headerPhone: string
  showTrackOrder: boolean
  showGiftFinder: boolean

  // 3. Hero & Storefront Showcase
  heroBadge: string
  heroHeadline: string
  heroSubheadline: string
  heroPrimaryBtnText: string
  heroPrimaryBtnLink: string
  heroSecondaryBtnText: string
  heroSecondaryBtnLink: string

  // Trust Stats
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Value: string
  stat3Label: string

  // 4. Shipping, Delivery & Orders
  freeShippingThreshold: number
  shippingCostBaghdad: number
  shippingCostProvinces: number
  deliveryTimeEstimate: string
  minOrderValue: number
  enableGiftPackaging: boolean
  enableGiftCardNote: boolean

  // 5. Payment Methods
  allowCod: boolean
  allowOnlinePayment: boolean
  enableZainCash: boolean
  zainCashNumber?: string | null
  enableFib: boolean
  fibAccountNumber?: string | null
  paymentNotes?: string | null

  // 6. Contact Information & Working Hours
  storeEmail: string
  storePhone: string
  whatsappNumber: string
  storeAddress: string
  addressDetails?: string | null
  workingHours: string

  // 7. Social Media Links
  instagramUrl?: string | null
  facebookUrl?: string | null
  tiktokUrl?: string | null
  telegramUrl?: string | null

  // 8. Footer & Features
  footerCtaTitle: string
  footerCtaSubtitle: string
  footerCtaBtnText: string
  footerCtaBtnLink: string
  showFooterCta: boolean
  copyrightText: string

  // Features
  feature1Title: string
  feature1Desc: string
  feature2Title: string
  feature2Desc: string
  feature3Title: string
  feature3Desc: string
  feature4Title: string
  feature4Desc: string

  // 9. SEO & Notifications
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  orderNotifications: boolean
  marketingEmails: boolean
  lowStockThreshold: number
}

type TabType = 'general' | 'hero' | 'header' | 'shipping' | 'payment' | 'contact' | 'social' | 'footer' | 'seo'

const TABS: { id: TabType; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'general', label: 'الهوية والبيانات', icon: Store, desc: 'اسم المتجر، الشعار، العملة، ووضع الصيانة' },
  { id: 'hero', label: 'الواجهة والبانر', icon: Sparkles, desc: 'العناوين الرئيسية، الأزرار، وإحصائيات الثقة' },
  { id: 'header', label: 'الترويسة والإعلانات', icon: Megaphone, desc: 'الشريط الإعلاني العلوي وروابط الترويسة' },
  { id: 'shipping', label: 'الشحن والطلبات', icon: Truck, desc: 'حد الشحن المجاني وتكاليف التوصيل' },
  { id: 'payment', label: 'طرق الدفع', icon: CreditCard, desc: 'الدفع عند الاستلام، زين كاش، و FIB' },
  { id: 'contact', label: 'التواصل والعمل', icon: PhoneCall, desc: 'أرقام الاتصال، الواتساب، وأوقات الدوام' },
  { id: 'social', label: 'التواصل الاجتماعي', icon: Share2, desc: 'روابط انستغرام، فيسبوك، وتيك توك' },
  { id: 'footer', label: 'المزايا والفوتر', icon: Gift, desc: 'المزايا الأربعة، بانر الفوتر، وحقوق النشر' },
  { id: 'seo', label: 'السيو والنظام', icon: ShieldCheck, desc: 'محركات البحث، الكلمات المفتاحية، والإشعارات' },
]

export default function SettingsClient({ initialSettings }: { initialSettings: SettingsData }) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings)
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateField = <K extends keyof SettingsData>(field: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updateStoreSettings(settings)
    setIsSaving(false)
    if (res.success) {
      setHasChanges(false)
      toast.success('تم حفظ إعدادات المتجر بنجاح وتحديث كافة صفحات الموقع!')
    } else {
      toast.error(res.error || 'حدث خطأ أثناء حفظ الإعدادات')
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 font-sans text-start" dir="rtl">
      
      {/* Top Banner Header with Save Button */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
          >
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إعدادات المتجر والواجهة</h1>
            <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">تحكم شامل وفوري في جميع تفاصيل ونصوص وهيكلية المتجر</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              تعديلات غير محفوظة
            </span>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="text-white rounded-xl h-11 px-7 font-extrabold shadow-md hover:-translate-y-0.5 transition-all text-sm cursor-pointer w-full sm:w-auto"
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
                حفظ كافة التغييرات
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Prominent Navigation Tabs Grid / Bar */}
      <div className="bg-white p-2.5 border border-[#E8E4DF] rounded-3xl shadow-sm">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-2xl text-xs font-black transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-[#1C1917] text-white shadow-md scale-[1.02]"
                    : "bg-[#FAFAF8] text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] border border-[#E8E4DF]/70"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#C9A96E]" : "text-[#A8A29E]")} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. General & Store Identity                               */}
      {/* ========================================================= */}
      {activeTab === 'general' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">الهوية والبيانات الأساسية</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">اسم المتجر، الشعار اللفظي، والبيانات التعريفية المعروضة للزبائن.</p>
            </div>
            <Store className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">اسم المتجر الرسمي *</Label>
                <Input 
                  value={settings.storeName} 
                  onChange={e => updateField('storeName', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus:border-[#C9A96E]/50 focus:bg-white"
                  placeholder="مثال: گفتي بلس | Gifty Plus"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">يظهر في ترويسة الموقع، التذييل، والفواتير والرسائل</span>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رمز العملة المعتمدة *</Label>
                <Input 
                  value={settings.currency} 
                  onChange={e => updateField('currency', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus:border-[#C9A96E]/50 focus:bg-white"
                  placeholder="مثال: د.ع أو $"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">رمز العملة الافتراضي للأسعار في المتجر</span>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الشعار اللفظي / السلوغان (Tagline)</Label>
              <Input 
                value={settings.storeSlogan} 
                onChange={e => updateField('storeSlogan', e.target.value)}
                className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus:border-[#C9A96E]/50 focus:bg-white"
                placeholder="مثال: خلّي هديتك تحچي عنك ✨"
              />
              <span className="text-[11px] text-[#A8A29E] mt-1 block">عبارة ترويجية مميزة تظهر أسفل الشعار في الفوتر ومحركات البحث</span>
            </div>

            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">النبذة التعريفية للمتجر (About Summary)</Label>
              <Textarea 
                rows={3}
                value={settings.storeDescription} 
                onChange={e => updateField('storeDescription', e.target.value)}
                className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus:border-[#C9A96E]/50 focus:bg-white resize-none"
                placeholder="الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة..."
              />
              <span className="text-[11px] text-[#A8A29E] mt-1 block">النص التعريفي المعتمد في تذييل الموقع وفي صفحة من نحن</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#F0ECE6]">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط الشعار الرئيسي (Logo URL)</Label>
                <Input 
                  value={settings.logoUrl || ''} 
                  onChange={e => updateField('logoUrl', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="https://example.com/logo.png"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">اتركه فارغاً لاستخدام الشعار التفاعلي الفاخر المدمج</span>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط أيقونة الموقع (Favicon URL)</Label>
                <Input 
                  value={settings.faviconUrl || ''} 
                  onChange={e => updateField('faviconUrl', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="https://example.com/favicon.ico"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">أيقونة المتصفح تظهر بجوار عنوان الصفحة</span>
              </div>
            </div>

            {/* Maintenance Mode Option */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    وضع الصيانة المؤقت (Maintenance Mode)
                  </p>
                  <p className="text-xs text-[#78716C] mt-0.5">إيقاف استقبال الزوار مؤقتاً أثناء التحديث مع إظهار رسالة تنبيهية</p>
                </div>
                <Switch 
                  checked={settings.maintenanceMode}
                  onCheckedChange={val => updateField('maintenanceMode', val)}
                />
              </div>

              {settings.maintenanceMode && (
                <div>
                  <Label className="text-xs font-bold text-rose-900 mb-1.5 block">رسالة الصيانة للزوار</Label>
                  <Input 
                    value={settings.maintenanceMessage} 
                    onChange={e => updateField('maintenanceMessage', e.target.value)}
                    className="h-10 rounded-xl bg-white border-rose-300 text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Hero & Storefront Showcase                             */}
      {/* ========================================================= */}
      {activeTab === 'hero' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">الواجهة وقسم البانر الرئيسي (Hero Showcase)</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">التحكم في العنوان الرئيسي، الشارة الترويجية، الأزرار، وإحصائيات الثقة.</p>
            </div>
            <Sparkles className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Live Preview Box */}
            <div className="p-6 rounded-2xl bg-[#1C1917] text-white border border-[#C9A96E]/30 relative overflow-hidden shadow-sm">
              <div className="absolute top-3 start-4 text-[10px] font-bold text-[#C9A96E] bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="w-3 h-3" />
                معاينة حية ومباشرة لشكل البانر
              </div>
              <div className="mt-5 max-w-xl text-start">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/30 mb-3">
                  {settings.heroBadge || 'شارة البانر'}
                </span>
                <h3 className="text-2xl font-black tracking-tight leading-snug whitespace-pre-line text-white">
                  {settings.heroHeadline || 'العنوان الرئيسي للبانر'}
                </h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  {settings.heroSubheadline || 'العنوان الفرعي للبانر الترويجي'}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <span 
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                  >
                    {settings.heroPrimaryBtnText || 'زر رئيسي'}
                  </span>
                  <span className="px-4 py-2 rounded-xl text-xs font-bold text-white/80 bg-white/10 border border-white/20">
                    {settings.heroSecondaryBtnText || 'زر ثانوي'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">شارة البانر الترويجية (Hero Badge) *</Label>
                <Input 
                  value={settings.heroBadge} 
                  onChange={e => updateField('heroBadge', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="مثال: التشكيلة الجديدة كلياً لعام 2026 ✨"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">العنوان الرئيسي للبانر (Hero Headline) *</Label>
                <Input 
                  value={settings.heroHeadline} 
                  onChange={e => updateField('heroHeadline', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                  placeholder="مثال: لحظاتك الثمينة تستحق الأفضل."
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">العنوان الفرعي والوصف الترويجي (Hero Subheadline) *</Label>
                <Textarea 
                  rows={3}
                  value={settings.heroSubheadline} 
                  onChange={e => updateField('heroSubheadline', e.target.value)}
                  className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm resize-none"
                  placeholder="اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية..."
                />
              </div>

              {/* Primary Button */}
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">نص زر البانر الرئيسي (Primary Button)</Label>
                <Input 
                  value={settings.heroPrimaryBtnText} 
                  onChange={e => updateField('heroPrimaryBtnText', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="اكتشف التشكيلة الفاخرة"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط زر البانر الرئيسي</Label>
                <Input 
                  value={settings.heroPrimaryBtnLink} 
                  onChange={e => updateField('heroPrimaryBtnLink', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="/shop"
                />
              </div>

              {/* Secondary Button */}
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">نص زر البانر الثانوي (Secondary Button)</Label>
                <Input 
                  value={settings.heroSecondaryBtnText} 
                  onChange={e => updateField('heroSecondaryBtnText', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="مكتشف الهدايا الذكي"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط زر البانر الثانوي</Label>
                <Input 
                  value={settings.heroSecondaryBtnLink} 
                  onChange={e => updateField('heroSecondaryBtnLink', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="/gift-finder"
                />
              </div>
            </div>

            {/* Trust Statistics Settings */}
            <div className="pt-4 border-t border-[#F0ECE6]">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#A07850] mb-3">
                إحصائيات الثقة الثلاثة المعروضة أسفل البانر
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
                  <p className="text-xs font-bold text-[#1C1917]">الإحصائية الأولى</p>
                  <Input 
                    placeholder="القيمة مثل: +15K" 
                    value={settings.stat1Value} 
                    onChange={e => updateField('stat1Value', e.target.value)} 
                    className="h-9 text-xs bg-white" 
                  />
                  <Input 
                    placeholder="الوصف مثل: عميل سعيد وموثوق" 
                    value={settings.stat1Label} 
                    onChange={e => updateField('stat1Label', e.target.value)} 
                    className="h-9 text-xs bg-white" 
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
                  <p className="text-xs font-bold text-[#1C1917]">الإحصائية الثانية</p>
                  <Input 
                    placeholder="القيمة مثل: 4.9★" 
                    value={settings.stat2Value} 
                    onChange={e => updateField('stat2Value', e.target.value)} 
                    className="h-9 text-xs bg-white" 
                  />
                  <Input 
                    placeholder="الوصف مثل: تقييم خدماتنا" 
                    value={settings.stat2Label} 
                    onChange={e => updateField('stat2Label', e.target.value)} 
                    className="h-9 text-xs bg-white" 
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
                  <p className="text-xs font-bold text-[#1C1917]">الإحصائية الثالثة</p>
                  <Input 
                    placeholder="القيمة مثل: 100%" 
                    value={settings.stat3Value} 
                    onChange={e => updateField('stat3Value', e.target.value)} 
                    className="h-9 text-xs bg-white" 
                  />
                  <Input 
                    placeholder="الوصف مثل: تغليف يدوي ملكي" 
                    value={settings.stat3Label} 
                    onChange={e => updateField('stat3Label', e.target.value)} 
                    className="h-9 text-xs bg-white" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Header & Announcement Bar                              */}
      {/* ========================================================= */}
      {activeTab === 'header' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">الترويسة والشريط الإعلاني العلوي</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">التحكم في الشريط الترويجي الأسود أعلى الموقع وعناصر الترويسة.</p>
            </div>
            <Megaphone className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Announcement Bar Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
              <div>
                <p className="text-sm font-bold text-[#1C1917]">تفعيل الشريط الإعلاني العلوي (Announcement Bar)</p>
                <p className="text-xs text-[#78716C]">إظهار شريط الإعلانات الترويجي المميز في أعلى المتجر</p>
              </div>
              <Switch 
                checked={settings.showTopBar}
                onCheckedChange={val => updateField('showTopBar', val)}
              />
            </div>

            {settings.showTopBar && (
              <div className="space-y-4 p-5 rounded-2xl bg-[#F8F5F0] border border-[#E8E4DF]">
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">نص الإعلان في الشريط العلوي *</Label>
                  <Input 
                    value={settings.topBarText} 
                    onChange={e => updateField('topBarText', e.target.value)}
                    className="h-11 rounded-xl bg-white border-[#E8E4DF] text-sm"
                    placeholder="مثال: توصيل مجاني لكافة طلبات الهدايا الأكثر من 100 ألف د.ع • تغليف ملكي مجاني 🎁"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط عند الضغط على الشريط العلوي</Label>
                    <Input 
                      value={settings.topBarLink || ''} 
                      onChange={e => updateField('topBarLink', e.target.value)}
                      className="h-11 rounded-xl bg-white border-[#E8E4DF] text-sm"
                      dir="ltr"
                      placeholder="/category/offers"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رقم الهاتف الظاهر في الترويسة</Label>
                    <Input 
                      value={settings.headerPhone} 
                      onChange={e => updateField('headerPhone', e.target.value)}
                      className="h-11 rounded-xl bg-white border-[#E8E4DF] text-sm"
                      dir="ltr"
                      placeholder="+964 770 000 0000"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">رابط تتبع الشحنة في الترويسة</p>
                  <p className="text-xs text-[#78716C]">إظهار زر تتبع الطلب مباشرة في الشريط العلوي</p>
                </div>
                <Switch 
                  checked={settings.showTrackOrder}
                  onCheckedChange={val => updateField('showTrackOrder', val)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">زر مكتشف الهدايا الذكي</p>
                  <p className="text-xs text-[#78716C]">إظهار زر مكتشف الهدايا الذهبي التفاعلي في الترويسة</p>
                </div>
                <Switch 
                  checked={settings.showGiftFinder}
                  onCheckedChange={val => updateField('showGiftFinder', val)}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Shipping, Delivery & Orders                            */}
      {/* ========================================================= */}
      {activeTab === 'shipping' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">الشحن والتوصيل وخيارات الطلبات</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">الحد الأدنى للشحن المجاني، تكاليف التوصيل، وسياسات التغليف والإهداء.</p>
            </div>
            <Truck className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الحد الأدنى للشحن المجاني ({settings.currency}) *</Label>
                <Input 
                  type="number"
                  value={settings.freeShippingThreshold} 
                  onChange={e => updateField('freeShippingThreshold', Number(e.target.value))}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">يتم تفعيل الشحن المجاني في السلة وصفحة الدفع تلقائياً فوق هذا المبلغ</span>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">سعر التوصيل الأساسي / بغداد ({settings.currency}) *</Label>
                <Input 
                  type="number"
                  value={settings.shippingCostBaghdad} 
                  onChange={e => updateField('shippingCostBaghdad', Number(e.target.value))}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">التكلفة المطبقة عند عدم بلوغ حد الشحن المجاني</span>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">سعر التوصيل للمحافظات ({settings.currency})</Label>
                <Input 
                  type="number"
                  value={settings.shippingCostProvinces} 
                  onChange={e => updateField('shippingCostProvinces', Number(e.target.value))}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">كلفة الشحن التقديرية لبقية المحافظات العراقية</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">مدة التوصيل المتوقعة *</Label>
                <Input 
                  value={settings.deliveryTimeEstimate} 
                  onChange={e => updateField('deliveryTimeEstimate', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="مثال: 24 - 48 ساعة"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الحد الأدنى لقيمة الطلب ({settings.currency})</Label>
                <Input 
                  type="number"
                  value={settings.minOrderValue} 
                  onChange={e => updateField('minOrderValue', Number(e.target.value))}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                />
                <span className="text-[11px] text-[#A8A29E] mt-1 block">اتركه 0 إذا لم يكن هناك حد أدنى لإتمام الطلب</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0ECE6]">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">التغليف الملكي المجاني للهدية</p>
                  <p className="text-xs text-[#78716C]">تفعيل ميزة التغليف الفاخر مجاناً لجميع الطلبات بشكل افتراضي</p>
                </div>
                <Switch 
                  checked={settings.enableGiftPackaging}
                  onCheckedChange={val => updateField('enableGiftPackaging', val)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">كارت إهداء بكلمات الزبون</p>
                  <p className="text-xs text-[#78716C]">السماح للزبون بإرفاق نص ورسالة إهداء شخصية مع الهدية</p>
                </div>
                <Switch 
                  checked={settings.enableGiftCardNote}
                  onCheckedChange={val => updateField('enableGiftCardNote', val)}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. Payment Methods                                        */}
      {/* ========================================================= */}
      {activeTab === 'payment' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">طرق الدفع والتحصيل المعتمدة</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">التحكم في خيارات وبوابات الدفع المعروضة للزبائن في صفحة إتمام الطلب.</p>
            </div>
            <CreditCard className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* Cash on Delivery */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
              <div>
                <p className="text-sm font-bold text-[#1C1917]">الدفع عند الاستلام نقداً (Cash on Delivery)</p>
                <p className="text-xs text-[#78716C]">السماح للزبون بفحص الهدية والدفع لمندوب التوصيل عند الباب</p>
              </div>
              <Switch 
                checked={settings.allowCod}
                onCheckedChange={val => updateField('allowCod', val)}
              />
            </div>

            {/* Zain Cash */}
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">محفظة زين كاش (Zain Cash)</p>
                  <p className="text-xs text-[#78716C]">تمكين خيار التحويل المباشر عبر محفظة زين كاش</p>
                </div>
                <Switch 
                  checked={settings.enableZainCash}
                  onCheckedChange={val => updateField('enableZainCash', val)}
                />
              </div>
              {settings.enableZainCash && (
                <div className="pt-2">
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رقم محفظة زين كاش المعتمدة</Label>
                  <Input 
                    value={settings.zainCashNumber || ''} 
                    onChange={e => updateField('zainCashNumber', e.target.value)}
                    className="h-10 rounded-xl bg-white border-[#E8E4DF] text-xs"
                    dir="ltr"
                    placeholder="07800000000"
                  />
                </div>
              )}
            </div>

            {/* FIB */}
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">مصرف العراق الأول (First Iraqi Bank - FIB)</p>
                  <p className="text-xs text-[#78716C]">تمكين التحويل عبر تطبيق وحساب FIB المصرفي</p>
                </div>
                <Switch 
                  checked={settings.enableFib}
                  onCheckedChange={val => updateField('enableFib', val)}
                />
              </div>
              {settings.enableFib && (
                <div className="pt-2">
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رقم الحساب / الآيبان (FIB IBAN)</Label>
                  <Input 
                    value={settings.fibAccountNumber || ''} 
                    onChange={e => updateField('fibAccountNumber', e.target.value)}
                    className="h-10 rounded-xl bg-white border-[#E8E4DF] text-xs"
                    dir="ltr"
                    placeholder="IQ00FIB00000000000000"
                  />
                </div>
              )}
            </div>

            {/* Online Payment Cards */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
              <div>
                <p className="text-sm font-bold text-[#1C1917]">بطاقات الدفع الإلكتروني المباشر (Visa / Mastercard / Qi Card)</p>
                <p className="text-xs text-[#78716C]">تمكين بوابات الدفع الإلكتروني المباشر</p>
              </div>
              <Switch 
                checked={settings.allowOnlinePayment}
                onCheckedChange={val => updateField('allowOnlinePayment', val)}
              />
            </div>

            {/* Payment Instructions */}
            <div className="pt-3 border-t border-[#F0ECE6]">
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">تعليمات وملاحظات الدفع للزبائن (Payment Notes)</Label>
              <Textarea 
                rows={2}
                value={settings.paymentNotes || ''} 
                onChange={e => updateField('paymentNotes', e.target.value)}
                className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm resize-none"
                placeholder="ملاحظات تظهر للزبون في صفحة الدفع..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. Contact Information & Working Hours                    */}
      {/* ========================================================= */}
      {activeTab === 'contact' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">بيانات التواصل وخدمة العملاء وأوقات العمل</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">المعلومات المعتمدة في صفحة اتصل بنا، التذييل، والترويسة.</p>
            </div>
            <PhoneCall className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رقم هاتف خدمة العملاء الرئيسي *</Label>
                <Input 
                  value={settings.storePhone} 
                  onChange={e => updateField('storePhone', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="+964 770 123 4567"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رقم الواتساب المباشر للطلبات (WhatsApp) *</Label>
                <Input 
                  value={settings.whatsappNumber} 
                  onChange={e => updateField('whatsappNumber', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="+9647700000000"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">البريد الإلكتروني الرسمي لخدمة العملاء *</Label>
                <Input 
                  type="email"
                  value={settings.storeEmail} 
                  onChange={e => updateField('storeEmail', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="info@giftstore.iq"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">أوقات وساعات العمل والدوام *</Label>
                <Input 
                  value={settings.workingHours} 
                  onChange={e => updateField('workingHours', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="السبت – الخميس: 9:00 ص – 10:00 م"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">العنوان الفعلي للمحل أو المقر *</Label>
                <Input 
                  value={settings.storeAddress} 
                  onChange={e => updateField('storeAddress', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="بغداد، المنصور، شارع 14 رمضان"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">تفاصيل الموقع / أقرب نقطة دالة</Label>
                <Input 
                  value={settings.addressDetails || ''} 
                  onChange={e => updateField('addressDetails', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="بالقرب من مول المنصور"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. Social Media Links                                     */}
      {/* ========================================================= */}
      {activeTab === 'social' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">حسابات وروابط مواقع التواصل الاجتماعي</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">الروابط التي تفتح عند ضغط الزوار على أيقونات التواصل في تذييل الموقع وصفحة الاتصال.</p>
            </div>
            <Share2 className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط حساب إنستغرام (Instagram)</Label>
                <Input 
                  value={settings.instagramUrl || ''} 
                  onChange={e => updateField('instagramUrl', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="https://instagram.com/giftstore"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط صفحة فيسبوك (Facebook)</Label>
                <Input 
                  value={settings.facebookUrl || ''} 
                  onChange={e => updateField('facebookUrl', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="https://facebook.com/giftstore"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط حساب تيك توك (TikTok)</Label>
                <Input 
                  value={settings.tiktokUrl || ''} 
                  onChange={e => updateField('tiktokUrl', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="https://tiktok.com/@giftstore"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط قناة أو حساب تيليغرام (Telegram)</Label>
                <Input 
                  value={settings.telegramUrl || ''} 
                  onChange={e => updateField('telegramUrl', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="https://t.me/giftstore"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. Footer & Features                                      */}
      {/* ========================================================= */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {/* Homepage 4 Features */}
          <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-[#1C1917]">مزايا المتجر الأربعة (Storefront Features)</h2>
                <p className="text-xs text-[#78716C] mt-1 font-medium">البطاقات الأربعة الرئيسية المعروضة أسفل البانر في الصفحة الرئيسية.</p>
              </div>
              <Layers className="w-5 h-5 text-[#C9A96E]" />
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Feature 1 */}
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
                  <span className="text-xs font-extrabold text-[#C9A96E]">الميزة الأولى (الشحن)</span>
                  <Input 
                    value={settings.feature1Title} 
                    onChange={e => updateField('feature1Title', e.target.value)}
                    placeholder="عنوان الميزة الأولى"
                    className="h-10 text-xs bg-white font-bold"
                  />
                  <Textarea 
                    rows={2}
                    value={settings.feature1Desc} 
                    onChange={e => updateField('feature1Desc', e.target.value)}
                    placeholder="وصف الميزة الأولى"
                    className="text-xs bg-white resize-none"
                  />
                </div>

                {/* Feature 2 */}
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
                  <span className="text-xs font-extrabold text-[#E85D75]">الميزة الثانية (التغليف)</span>
                  <Input 
                    value={settings.feature2Title} 
                    onChange={e => updateField('feature2Title', e.target.value)}
                    placeholder="عنوان الميزة الثانية"
                    className="h-10 text-xs bg-white font-bold"
                  />
                  <Textarea 
                    rows={2}
                    value={settings.feature2Desc} 
                    onChange={e => updateField('feature2Desc', e.target.value)}
                    placeholder="وصف الميزة الثانية"
                    className="text-xs bg-white resize-none"
                  />
                </div>

                {/* Feature 3 */}
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
                  <span className="text-xs font-extrabold text-emerald-600">الميزة الثالثة (الدفع عند الاستلام)</span>
                  <Input 
                    value={settings.feature3Title} 
                    onChange={e => updateField('feature3Title', e.target.value)}
                    placeholder="عنوان الميزة الثالثة"
                    className="h-10 text-xs bg-white font-bold"
                  />
                  <Textarea 
                    rows={2}
                    value={settings.feature3Desc} 
                    onChange={e => updateField('feature3Desc', e.target.value)}
                    placeholder="وصف الميزة الثالثة"
                    className="text-xs bg-white resize-none"
                  />
                </div>

                {/* Feature 4 */}
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] space-y-3">
                  <span className="text-xs font-extrabold text-indigo-600">الميزة الرابعة (المستشار الذكي)</span>
                  <Input 
                    value={settings.feature4Title} 
                    onChange={e => updateField('feature4Title', e.target.value)}
                    placeholder="عنوان الميزة الرابعة"
                    className="h-10 text-xs bg-white font-bold"
                  />
                  <Textarea 
                    rows={2}
                    value={settings.feature4Desc} 
                    onChange={e => updateField('feature4Desc', e.target.value)}
                    placeholder="وصف الميزة الرابعة"
                    className="text-xs bg-white resize-none"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Footer CTA & Copyright */}
          <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-[#1C1917]">بانر الفوتر الترويجي وحقوق النشر</h2>
                <p className="text-xs text-[#78716C] mt-1 font-medium">التحكم في البانر الدعائي أعلى تذييل الصفحة ونصوص حقوق الملكية.</p>
              </div>
              <Gift className="w-5 h-5 text-[#C9A96E]" />
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">إظهار بانر الفوتر الدعائي (Footer CTA Banner)</p>
                  <p className="text-xs text-[#78716C]">عرض البانر الترويجي الكبير أعلى تذييل الصفحة</p>
                </div>
                <Switch 
                  checked={settings.showFooterCta}
                  onCheckedChange={val => updateField('showFooterCta', val)}
                />
              </div>

              {settings.showFooterCta && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-[#F8F5F0] border border-[#E8E4DF]">
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">عنوان بانر الفوتر</Label>
                    <Input 
                      value={settings.footerCtaTitle} 
                      onChange={e => updateField('footerCtaTitle', e.target.value)}
                      className="h-11 rounded-xl bg-white border-[#E8E4DF] text-sm font-bold"
                      placeholder="هل تبحث عن هدية لا تُنسى؟"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">النص الفرعي لبانر الفوتر</Label>
                    <Input 
                      value={settings.footerCtaSubtitle} 
                      onChange={e => updateField('footerCtaSubtitle', e.target.value)}
                      className="h-11 rounded-xl bg-white border-[#E8E4DF] text-sm"
                      placeholder="جرّب مكتشف الهدايا الذكي..."
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">نص زر بانر الفوتر</Label>
                    <Input 
                      value={settings.footerCtaBtnText} 
                      onChange={e => updateField('footerCtaBtnText', e.target.value)}
                      className="h-11 rounded-xl bg-white border-[#E8E4DF] text-sm font-bold"
                      placeholder="جرّب مكتشف الهدايا"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط زر بانر الفوتر</Label>
                    <Input 
                      value={settings.footerCtaBtnLink} 
                      onChange={e => updateField('footerCtaBtnLink', e.target.value)}
                      className="h-11 rounded-xl bg-white border-[#E8E4DF] text-sm"
                      dir="ltr"
                      placeholder="/gift-finder"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">نص حقوق النشر والملكية (Copyright)</Label>
                <Input 
                  value={settings.copyrightText} 
                  onChange={e => updateField('copyrightText', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  placeholder="© 2026 گِفتي بلس | Gifty Plus. جميع الحقوق محفوظة."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. SEO & System Notifications                             */}
      {/* ========================================================= */}
      {activeTab === 'seo' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917]">تحسين محركات البحث (SEO) والتنبيهات</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">البيانات التعريفية للظهور في محركات بحث Google وإعدادات إشعارات المتجر.</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#C9A96E]" />
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">عنوان الموقع في محركات البحث (SEO Meta Title)</Label>
              <Input 
                value={settings.metaTitle} 
                onChange={e => updateField('metaTitle', e.target.value)}
                className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                placeholder="گِفتي بلس | متجر الهدايا الفاخرة الأول في العراق"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">وصف الموقع لمحركات البحث (SEO Meta Description)</Label>
              <Textarea 
                rows={3}
                value={settings.metaDescription} 
                onChange={e => updateField('metaDescription', e.target.value)}
                className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm resize-none"
                placeholder="الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة في العراق..."
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الكلمات الدلالية المفتاحية (Meta Keywords)</Label>
              <Input 
                value={settings.metaKeywords} 
                onChange={e => updateField('metaKeywords', e.target.value)}
                className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                placeholder="هدايا, عطور, ساعات, تغليف هدايا, العراق, بغداد"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0ECE6]">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">إشعارات الطلبات الجديدة</p>
                  <p className="text-xs text-[#78716C]">تنبيه الإدارة فور ورود أي طلب جديد عبر لوحة التحكم</p>
                </div>
                <Switch 
                  checked={settings.orderNotifications}
                  onCheckedChange={val => updateField('orderNotifications', val)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">رسائل التحديثات التسويقية</p>
                  <p className="text-xs text-[#78716C]">إرسال عروض ترويجية للزبائن في القائمة البريدية</p>
                </div>
                <Switch 
                  checked={settings.marketingEmails}
                  onCheckedChange={val => updateField('marketingEmails', val)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">حد التنبيه لنقص المخزون (قطع)</Label>
              <Input 
                type="number"
                value={settings.lowStockThreshold} 
                onChange={e => updateField('lowStockThreshold', Number(e.target.value))}
                className="h-11 max-w-xs rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
              />
              <span className="text-[11px] text-[#A8A29E] mt-1 block">يظهر تنبيه في لوحة الإدارة عند وصول كمية أي منتج إلى هذا الحد أو أقل</span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
