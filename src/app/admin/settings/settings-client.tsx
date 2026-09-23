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
  ChevronLeft,
  MessageCircle,
  ArrowLeft
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
  whatsappOrderEnabled: boolean
  whatsappWelcomeMsg: string
  whatsappFooterNote: string
  storeAddress: string
  addressDetails?: string | null
  workingHours: string

  // 7. Social Media Links
  instagramUrl?: string | null
  facebookUrl?: string | null
  tiktokUrl?: string | null
  telegramUrl?: string | null

  // 8. Footer & Features
  footerCtaBadge: string
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

type TabType = 'general' | 'hero' | 'header' | 'shipping' | 'payment' | 'whatsapp' | 'contact' | 'social' | 'footer' | 'seo'

const TABS: { id: TabType; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'general', label: 'الهوية والبيانات', icon: Store, desc: 'اسم المتجر، الشعار، العملة، ووضع الصيانة' },
  { id: 'hero', label: 'الواجهة والبانر', icon: Sparkles, desc: 'العناوين الرئيسية، الأزرار، وإحصائيات الثقة' },
  { id: 'header', label: 'الترويسة والإعلانات', icon: Megaphone, desc: 'الشريط الإعلاني العلوي وروابط الترويسة' },
  { id: 'shipping', label: 'الشحن والطلبات', icon: Truck, desc: 'حد الشحن المجاني وتكاليف التوصيل' },
  { id: 'payment', label: 'طرق الدفع', icon: CreditCard, desc: 'الدفع عند الاستلام، زين كاش، و FIB' },
  { id: 'whatsapp', label: 'إعدادات WhatsApp', icon: MessageCircle, desc: 'رقم واتساب المتجر، تفعيل الطلب، وتخصيص الرسائل' },
  { id: 'contact', label: 'التواصل والعمل', icon: PhoneCall, desc: 'أرقام الاتصال، الواتساب، وأوقات الدوام' },
  { id: 'social', label: 'التواصل الاجتماعي', icon: Share2, desc: 'روابط انستغرام، فيسبوك، وتيك توك' },
  { id: 'footer', label: 'بانر الفوتر والمزايا', icon: Gift, desc: 'بانر الدعوة للطلب (CTA)، المزايا الأربعة، وحقوق النشر' },
  { id: 'seo', label: 'السيو والنظام', icon: ShieldCheck, desc: 'محركات البحث، الكلمات المفتاحية، والإشعارات' },
]

export default function SettingsClient({ initialSettings }: { initialSettings: SettingsData }) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings)
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Listen to tab query param if accessed directly from sidebar
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab') as TabType
      if (tabParam && TABS.some(t => t.id === tabParam)) {
        setActiveTab(tabParam)
      }
    }
  }, [])

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

            {/* Quick jump to Footer CTA Banner */}
            <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#C9A96E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/20 flex items-center justify-center text-[#A07850] shrink-0">
                  <Gift className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#1C1917]">هل تبحث عن تعديل بانر الفوتر الدعائي (أسفل الموقع)؟</p>
                  <p className="text-[11px] text-[#78716C]">تخصيص عنوان البانر الترويجي الكبير، شارة الهدايا، وزر مكتشف الهدايا</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('footer')}
                className="h-9 px-4 rounded-xl border-[#C9A96E]/40 text-[#A07850] hover:bg-[#C9A96E]/10 text-xs font-bold cursor-pointer shrink-0"
              >
                <span>تعديل بانر الفوتر</span>
                <ChevronLeft className="w-3.5 h-3.5 ms-1" />
              </Button>
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
      {/* WhatsApp Settings Tab                                     */}
      {/* ========================================================= */}
      {activeTab === 'whatsapp' && (
        <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1917] flex items-center gap-2">
                <span>إعدادات WhatsApp ونظام الطلب المباشر</span>
                <span className="text-[10px] bg-[#25D366]/20 text-[#128C7E] px-2.5 py-0.5 rounded-full font-bold">
                  Guest WhatsApp Flow
                </span>
              </h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">
                إدارة رقم واتساب المتجر، تفعيل أو إيقاف استقبال الطلبات، وتخصيص صيغة الرسائل المجهزة.
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center">
              <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
              </svg>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Toggle Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#1C1917]">تفعيل استقبال الطلبات عبر WhatsApp</p>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                    settings.whatsappOrderEnabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  )}>
                    {settings.whatsappOrderEnabled ? 'مفعّل ويستقبل الطلبات' : 'معطل مؤقتاً'}
                  </span>
                </div>
                <p className="text-xs text-[#78716C] mt-1">
                  عند التعطيل، سيتم إخفاء أزرار إتمام الطلب عبر واتساب وإظهار تنبيه لطيف للعملاء في السلة.
                </p>
              </div>
              <Switch 
                checked={settings.whatsappOrderEnabled ?? true}
                onCheckedChange={val => updateField('whatsappOrderEnabled', val)}
              />
            </div>

            {/* Store WhatsApp Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1C1917] flex items-center justify-between">
                <span>رقم WhatsApp الخاص بالمتجر *</span>
                <span className="text-[11px] text-[#A8A29E] font-normal">صيغة دولية بدون + أو مسافات</span>
              </Label>
              <div className="flex gap-3">
                <Input 
                  value={settings.whatsappNumber || ''} 
                  onChange={e => updateField('whatsappNumber', e.target.value)}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm text-end font-mono focus:border-[#C9A96E]/50 focus:bg-white"
                  dir="ltr"
                  placeholder="9647XXXXXXXXX"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const clean = (settings.whatsappNumber || '').replace(/\D/g, '')
                    if (!clean) {
                      toast.error('يرجى كتابة رقم هاتف أولاً')
                      return
                    }
                    const url = `https://wa.me/${clean}?text=${encodeURIComponent('تجربة اتصال من لوحة تحكم متجر الهدايا ✅')}`
                    window.open(url, '_blank')
                  }}
                  className="h-11 px-4 rounded-xl border-[#E8E4DF] hover:bg-[#F5F0EA] text-xs font-bold text-[#1C1917] shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#25D366]" />
                  اختبار فتح الرقم
                </Button>
              </div>
              <p className="text-[11px] text-[#78716C]">
                💡 ملاحظة: يمكنك إدخال الرقم بصيغة محلية (مثل 07701234567) وسيقوم النظام تلقائياً بتحويله للصيغة الدولية 9647701234567 عند الحفظ.
              </p>
            </div>

            {/* Template Messages (Welcome & Footer) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#F0ECE6]">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#1C1917]">رسالة الترحيب (مقدمة الطلب)</Label>
                <Textarea 
                  rows={3}
                  value={settings.whatsappWelcomeMsg || ''} 
                  onChange={e => updateField('whatsappWelcomeMsg', e.target.value)}
                  className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs focus:border-[#C9A96E]/50 focus:bg-white resize-none"
                  placeholder="السلام عليكم 👋&#10;أرغب بتأكيد هذا الطلب:"
                />
                <span className="text-[11px] text-[#A8A29E] block">النص الذي يظهر في السطر الأول لرسالة واتساب</span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#1C1917]">ملاحظة الخاتمة (تذييل الطلب)</Label>
                <Textarea 
                  rows={3}
                  value={settings.whatsappFooterNote || ''} 
                  onChange={e => updateField('whatsappFooterNote', e.target.value)}
                  className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs focus:border-[#C9A96E]/50 focus:bg-white resize-none"
                  placeholder="أرجو تأكيد الطلب، شكراً ❤️"
                />
                <span className="text-[11px] text-[#A8A29E] block">النص الختامي ورسالة الشكر أسفل تفاصيل الطلب</span>
              </div>
            </div>

            {/* Live Interactive WhatsApp Bubble Preview */}
            <div className="pt-4 border-t border-[#F0ECE6]">
              <Label className="text-xs font-bold text-[#1C1917] mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                معاينة حية لشكل رسالة الطلب داخل WhatsApp:
              </Label>
              
              <div className="bg-[#EFEAE2] p-4 sm:p-6 rounded-2xl border border-[#D5D0C9] max-w-lg mx-auto">
                {/* Chat bubble */}
                <div className="bg-[#E7FFDB] p-4 rounded-2xl rounded-tr-none shadow-sm border border-[#D0EBC2] text-xs text-[#111B21] space-y-2 whitespace-pre-wrap font-sans">
                  <p className="font-bold">{settings.whatsappWelcomeMsg || 'السلام عليكم 👋\nأرغب بتأكيد هذا الطلب:'}</p>
                  <p className="font-mono text-[11px] font-bold text-[#128C7E]">🧾 رقم الطلب: ORD-20260922-101</p>
                  <div className="border-t border-[#D0EBC2] pt-2 text-[11px]">
                    <p className="font-bold">🛍️ تفاصيل الطلب:</p>
                    <p>━━━━━━━━━━━━━━</p>
                    <p>🎁 بوكس هدية ملكي فاخر</p>
                    <p className="text-stone-600">الكمية: 1 • السعر: 45,000 د.ع</p>
                    <p>━━━━━━━━━━━━━━</p>
                    <p>📦 التوصيل: مجاني 🎁</p>
                    <p className="font-bold text-stone-900">💰 المجموع الكلي: 45,000 د.ع</p>
                  </div>
                  <div className="border-t border-[#D0EBC2] pt-2 text-[11px]">
                    <p className="font-bold">👤 معلومات العميل:</p>
                    <p>الاسم: أحمد مصطفى</p>
                    <p>الهاتف: 07701234567</p>
                    <p>📍 طريقة الاستلام: توصيل للمنزل 🚚</p>
                    <p>📍 المحافظة: بغداد</p>
                    <p>📍 المنطقة: المنصور</p>
                  </div>
                  <p className="border-t border-[#D0EBC2] pt-2 text-[11px] text-stone-600">
                    {settings.whatsappFooterNote || 'أرجو تأكيد الطلب، شكراً ❤️'}
                  </p>
                  <div className="text-end text-[10px] text-stone-400">10:30 ص ✓✓</div>
                </div>
              </div>
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

              {/* Online Store Notice (No physical office or shop) */}
              <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#C9A96E]/30 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/20 flex items-center justify-center text-[#A07850] shrink-0 mt-0.5">
                  <Truck className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1C1917]">طبيعة المتجر: متجر إلكتروني 100% (أونلاين)</h4>
                  <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                    تم إلغاء العناوين الفعلية والمقار من المتجر العام وصفحة التواصل والفوتر. المتجر يعمل كمنصة بيع إلكترونية بالكامل ويتم توصيل الطلبات مباشرة لعنوان العميل عبر شركات التوصيل.
                  </p>
                </div>
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
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-black text-[#1C1917]">بانر الدعوة للطلب أسفل الموقع (Footer CTA Banner)</h2>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[11px] font-black border",
                    settings.showFooterCta 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-stone-100 text-stone-500 border-stone-200"
                  )}>
                    {settings.showFooterCta ? 'معروض للزوار' : 'مخفي حالياً'}
                  </span>
                </div>
                <p className="text-xs text-[#78716C] mt-1 font-medium">التحكم في البانر الترويجي الكبير أعلى تذييل الصفحة وتعديل كافة نصوصه وزر التوجيه.</p>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-bold text-[#1C1917]">
                  {settings.showFooterCta ? 'تفعيل البانر' : 'تعطيل البانر'}
                </span>
                <Switch 
                  checked={settings.showFooterCta}
                  onCheckedChange={val => updateField('showFooterCta', val)}
                />
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">

              {/* Real-time Interactive Preview of the Banner */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-[#78716C] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span>معاينة مباشرة لشكل البانر في تذييل الموقع</span>
                  </Label>
                  {!settings.showFooterCta && (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                      ملاحظة: البانر معطل ومخفي ولن يظهر للعملاء حتى تفعيله
                    </span>
                  )}
                </div>

                <div className="relative rounded-2xl bg-[#1C1917] text-white p-6 sm:p-8 overflow-hidden border border-[#3D3835] shadow-md">
                  {/* Subtle warm glow matching the storefront */}
                  <div className="absolute top-0 start-1/4 w-72 h-72 bg-[#C9A96E]/12 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 end-1/4 w-60 h-60 bg-[#E85D75]/10 rounded-full blur-[90px] pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="text-start space-y-1.5 max-w-xl">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96E] bg-[#C9A96E]/10 px-2.5 py-1 rounded-full border border-[#C9A96E]/20">
                        <Gift className="w-3.5 h-3.5" />
                        <span>{settings.footerCtaBadge || 'خدمة استثنائية لكافة المناسبات'}</span>
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {settings.footerCtaTitle || 'هل تبحث عن هدية لا تُنسى؟'}
                      </h3>
                      <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                        {settings.footerCtaSubtitle || 'جرّب مكتشف الهدايا الذكي للحصول على اقتراحات تلائم ذوقك وميزانيتك بدقة'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 h-11 px-6 rounded-xl font-black text-[#1C1917] text-xs sm:text-sm shadow-md shrink-0 pointer-events-none select-none"
                      style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                    >
                      <span>{settings.footerCtaBtnText || 'جرّب مكتشف الهدايا'}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* 1. Badge Text */}
                <div className="sm:col-span-2">
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">شارة البانر العلوية (Badge Text) *</Label>
                  <Input 
                    value={settings.footerCtaBadge} 
                    onChange={e => updateField('footerCtaBadge', e.target.value)}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                    placeholder="خدمة استثنائية لكافة المناسبات"
                  />
                  <p className="text-[11px] text-[#78716C] mt-1">النص الصغير مع أيقونة الهدية أعلى عنوان البانر</p>
                </div>

                {/* 2. Main Title */}
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">عنوان البانر الرئيسي (Main Heading) *</Label>
                  <Input 
                    value={settings.footerCtaTitle} 
                    onChange={e => updateField('footerCtaTitle', e.target.value)}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                    placeholder="هل تبحث عن هدية لا تُنسى؟"
                  />
                </div>

                {/* 3. Subtitle Description */}
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الوصف والنص التوضيحي (Subtitle) *</Label>
                  <Input 
                    value={settings.footerCtaSubtitle} 
                    onChange={e => updateField('footerCtaSubtitle', e.target.value)}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                    placeholder="جرّب مكتشف الهدايا الذكي للحصول على اقتراحات تلائم ذوقك وميزانيتك بدقة"
                  />
                </div>

                {/* 4. Button Text */}
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">نص زر الإجراء (Button CTA Text) *</Label>
                  <Input 
                    value={settings.footerCtaBtnText} 
                    onChange={e => updateField('footerCtaBtnText', e.target.value)}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                    placeholder="جرّب مكتشف الهدايا"
                  />
                </div>

                {/* 5. Button Link */}
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط الزر (Target Link) *</Label>
                  <Input 
                    value={settings.footerCtaBtnLink} 
                    onChange={e => updateField('footerCtaBtnLink', e.target.value)}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                    dir="ltr"
                    placeholder="/gift-finder أو /shop"
                  />
                  <p className="text-[11px] text-[#78716C] mt-1">الصفحة التي تفتح عند ضغط الزائر على الزر (مثال: /gift-finder أو /shop)</p>
                </div>
              </div>

              {/* Copyright */}
              <div className="pt-4 border-t border-[#E8E4DF]">
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">نص حقوق النشر والملكية أسفل الفوتر (Copyright)</Label>
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
