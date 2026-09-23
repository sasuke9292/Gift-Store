import React from 'react'
import SettingsClient, { SettingsData } from './settings-client'
import { getStoreSettings } from '@/app/actions/admin/settings'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings()
  
  const initialSettings: SettingsData = {
    // 1. General & Identity
    storeName: settings?.storeName || 'گفتي بلس | Gifty Plus',
    storeSlogan: settings?.storeSlogan || 'خلّي هديتك تحچي عنك ✨',
    storeDescription: settings?.storeDescription || 'الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة في العراق. تشكيلة منتقاة بعناية لجميع المناسبات مع تغليف يدوي راقٍ وتوصيل سريع وموثوق لكافة المحافظات.',
    currency: settings?.currency || 'د.ع',
    logoUrl: settings?.logoUrl || '',
    faviconUrl: settings?.faviconUrl || '',
    maintenanceMode: settings?.maintenanceMode ?? false,
    maintenanceMessage: settings?.maintenanceMessage || 'المتجر في وضع الصيانة والتحديث حالياً، سنعود إليكم قريباً بأجمل العروض!',

    // 2. Announcement & Header
    showTopBar: settings?.showTopBar ?? true,
    topBarText: settings?.topBarText || 'توصيل مجاني لكافة طلبات الهدايا الأكثر من 100 ألف د.ع • تغليف ملكي مجاني 🎁',
    topBarLink: settings?.topBarLink || '/shop',
    headerPhone: settings?.headerPhone || '+964 770 000 0000',
    showTrackOrder: settings?.showTrackOrder ?? true,
    showGiftFinder: settings?.showGiftFinder ?? true,

    // 3. Hero & Storefront Showcase
    heroBadge: settings?.heroBadge || 'التشكيلة الجديدة كلياً لعام 2026 ✨',
    heroHeadline: settings?.heroHeadline || 'لحظاتك الثمينة تستحق الأفضل.',
    heroSubheadline: settings?.heroSubheadline || 'اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية لتناسب أرقى الأذواق وتخلّد أجمل الذكريات.',
    heroPrimaryBtnText: settings?.heroPrimaryBtnText || 'اكتشف التشكيلة الفاخرة',
    heroPrimaryBtnLink: settings?.heroPrimaryBtnLink || '/shop',
    heroSecondaryBtnText: settings?.heroSecondaryBtnText || 'مكتشف الهدايا الذكي',
    heroSecondaryBtnLink: settings?.heroSecondaryBtnLink || '/gift-finder',

    // Hero Trust Stats
    stat1Value: settings?.stat1Value || '+15K',
    stat1Label: settings?.stat1Label || 'عميل سعيد وموثوق',
    stat2Value: settings?.stat2Value || '4.9★',
    stat2Label: settings?.stat2Label || 'تقييم خدماتنا',
    stat3Value: settings?.stat3Value || '100%',
    stat3Label: settings?.stat3Label || 'تغليف يدوي ملكي',

    // Hero Showcase Badges
    heroSlidesJson: settings?.heroSlidesJson || null,
    heroBadgeTopSmall: settings?.heroBadgeTopSmall || 'جودة أصلية ومضمونة',
    heroBadgeTopBold: settings?.heroBadgeTopBold || 'ضمان استبدال واسترجاع',
    heroBadgeBottomSmall: settings?.heroBadgeBottomSmall || 'خدمة استثنائية',
    heroBadgeBottomBold: settings?.heroBadgeBottomBold || 'تغليف مجاني مع كل طلب',

    // 4. Shipping, Delivery & Orders
    freeShippingThreshold: settings?.freeShippingThreshold ?? 100000,
    shippingCostBaghdad: settings?.shippingCostBaghdad ?? 5000,
    shippingCostProvinces: settings?.shippingCostProvinces ?? 7000,
    deliveryTimeEstimate: settings?.deliveryTimeEstimate || '24 - 48 ساعة',
    minOrderValue: settings?.minOrderValue ?? 0,
    enableGiftPackaging: settings?.enableGiftPackaging ?? true,
    enableGiftCardNote: settings?.enableGiftCardNote ?? true,

    // 5. Payment Methods
    allowCod: settings?.allowCod ?? true,
    allowOnlinePayment: settings?.allowOnlinePayment ?? false,
    enableZainCash: settings?.enableZainCash ?? true,
    zainCashNumber: settings?.zainCashNumber || '07800000000',
    enableFib: settings?.enableFib ?? true,
    fibAccountNumber: settings?.fibAccountNumber || 'IQ00FIB00000000000000',
    paymentNotes: settings?.paymentNotes || 'يمكنك الدفع نقداً عند استلام الهدية أو التحويل عبر زين كاش والبطاقات المصرفية.',

    // 6. Contact Information & Working Hours
    storeEmail: settings?.storeEmail || 'info@giftstore.iq',
    storePhone: settings?.storePhone || '+964 770 123 4567',
    whatsappNumber: settings?.whatsappNumber || '+9647700000000',
    whatsappOrderEnabled: settings?.whatsappOrderEnabled ?? true,
    whatsappWelcomeMsg: settings?.whatsappWelcomeMsg || 'السلام عليكم 👋\nأرغب بتأكيد هذا الطلب:',
    whatsappFooterNote: settings?.whatsappFooterNote || 'أرجو تأكيد الطلب، شكراً ❤️',
    storeAddress: settings?.storeAddress || 'بغداد، المنصور، شارع 14 رمضان',
    addressDetails: settings?.addressDetails || 'بالقرب من مول المنصور',
    workingHours: settings?.workingHours || 'السبت – الخميس: 9:00 ص – 10:00 م',

    // 7. Social Media Links
    instagramUrl: settings?.instagramUrl || 'https://instagram.com',
    facebookUrl: settings?.facebookUrl || 'https://facebook.com',
    tiktokUrl: settings?.tiktokUrl || 'https://tiktok.com',
    telegramUrl: settings?.telegramUrl || 'https://t.me',

    // 8. Footer & Features
    footerCtaBadge: settings?.footerCtaBadge || 'خدمة استثنائية لكافة المناسبات',
    footerCtaTitle: settings?.footerCtaTitle || 'هل تبحث عن هدية لا تُنسى؟',
    footerCtaSubtitle: settings?.footerCtaSubtitle || 'جرّب مكتشف الهدايا الذكي للحصول على اقتراحات تلائم ذوقك وميزانيتك بدقة',
    footerCtaBtnText: settings?.footerCtaBtnText || 'جرّب مكتشف الهدايا',
    footerCtaBtnLink: settings?.footerCtaBtnLink || '/gift-finder',
    showFooterCta: settings?.showFooterCta ?? true,
    copyrightText: settings?.copyrightText || '© 2026 گِفتي بلس | Gifty Plus. جميع الحقوق محفوظة.',

    // Features
    feature1Title: settings?.feature1Title || 'شحن سريع وموثوق',
    feature1Desc: settings?.feature1Desc || 'توصيل لكافة محافظات العراق خلال 24 - 48 ساعة مع تتبع فوري للشحنة',
    feature2Title: settings?.feature2Title || 'تغليف ملكي فاخر',
    feature2Desc: settings?.feature2Desc || 'علب هدايا فاخرة مع أشرطة حريرية وكارت إهداء بكلماتك مجاناً مع كل طلب',
    feature3Title: settings?.feature3Title || 'دفع آمن عند الاستلام',
    feature3Desc: settings?.feature3Desc || 'عاين هديتك وافحصها قبل الاستلام، مع خيارات دفع بـ زين كاش والماستر كارد',
    feature4Title: settings?.feature4Title || 'مستشار هدايا ذكي',
    feature4Desc: settings?.feature4Desc || 'خوارزمية ذكية وفريق متخصص يساعدك في اختيار الهدية المثالية لأي مناسبة',

    // 9. SEO & Notifications
    metaTitle: settings?.metaTitle || 'گِفتي بلس | متجر الهدايا الفاخرة الأول في العراق',
    metaDescription: settings?.metaDescription || 'الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة في العراق. تشكيلة منتقاة بعناية لجميع المناسبات مع تغليف يدوي راقٍ وتوصيل سريع.',
    metaKeywords: settings?.metaKeywords || 'هدايا, عطور, ساعات, هدايا رجالية, هدايا نسائية, تغليف هدايا, العراق, بغداد',
    orderNotifications: settings?.orderNotifications ?? true,
    marketingEmails: settings?.marketingEmails ?? true,
    lowStockThreshold: settings?.lowStockThreshold ?? 5,
  }

  return (
    <React.Suspense fallback={
      <div className="max-w-6xl mx-auto p-12 text-center text-[#78716C]">
        <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold">جاري تحميل إعدادات المتجر...</p>
      </div>
    }>
      <SettingsClient initialSettings={initialSettings} />
    </React.Suspense>
  )
}

