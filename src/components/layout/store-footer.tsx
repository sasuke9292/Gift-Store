import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, MessageCircle, Share2, Gift, ArrowLeft, ShieldCheck, CreditCard, Send } from 'lucide-react'

const footerLinks = {
  quickLinks: [
    { href: '/about', label: 'من نحن' },
    { href: '/shop', label: 'المتجر الإلكتروني' },
    { href: '/gift-finder', label: 'مكتشف الهدايا الذكي' },
    { href: '/track-order', label: 'تتبع الشحنة' },
    { href: '/faq', label: 'الأسئلة الشائعة' },
    { href: '/contact', label: 'اتصل بنا' },
  ],
  categories: [
    { href: '/category/men', label: 'هدايا رجالية فاخرة' },
    { href: '/category/women', label: 'هدايا نسائية راقية' },
    { href: '/category/kids', label: 'هدايا أطفال ومواليد' },
    { href: '/category/occasions', label: 'بوكسات المناسبات' },
    { href: '/category/custom', label: 'هدايا مخصصة بالاسم' },
    { href: '/category/offers', label: 'عروض وتخفيضات خاصة' },
  ],
}

interface StoreFooterProps {
  settings?: {
    storeName?: string
    storeSlogan?: string
    storeDescription?: string
    logoUrl?: string | null
    storePhone?: string | null
    storeEmail?: string | null
    storeAddress?: string | null
    whatsappNumber?: string | null
    instagramUrl?: string | null
    facebookUrl?: string | null
    tiktokUrl?: string | null
    telegramUrl?: string | null
    showFooterCta?: boolean
    footerCtaTitle?: string
    footerCtaSubtitle?: string
    footerCtaBtnText?: string
    footerCtaBtnLink?: string
    copyrightText?: string
  } | null
}

export function StoreFooter({ settings }: StoreFooterProps) {
  const storeName = settings?.storeName || 'گِفتي بلس | Gifty Plus'
  const storeSlogan = settings?.storeSlogan || 'خلّي هديتك تحچي عنك ✨'
  const storeDesc = settings?.storeDescription || 'الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة في العراق. تشكيلة منتقاة بعناية لجميع المناسبات مع تغليف يدوي راقٍ وتوصيل سريع وموثوق لكافة المحافظات.'
  const storePhone = settings?.storePhone || '+964 770 123 4567'
  const storeEmail = settings?.storeEmail || 'info@giftstore.iq'
  const storeAddress = settings?.storeAddress || 'بغداد، المنصور، شارع 14 رمضان'
  
  const rawWa = settings?.whatsappNumber || '9647700000000'
  const whatsappHref = rawWa.startsWith('http') 
    ? rawWa 
    : `https://wa.me/${rawWa.replace(/[^0-9]/g, '')}`

  const showCta = settings?.showFooterCta ?? true

  return (
    <footer className="bg-[#1C1917] text-white/80 relative overflow-hidden text-start" dir="rtl">
      {/* Subtle warm glow */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#C9A96E]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-80 h-80 bg-[#E85D75]/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Newsletter / CTA Banner */}
      {showCta && (
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96E] mb-2">
                  <Gift className="w-3.5 h-3.5" />
                  خدمة استثنائية لكافة المناسبات
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {settings?.footerCtaTitle || 'هل تبحث عن هدية لا تُنسى؟'}
                </h3>
                <p className="text-white/50 text-xs sm:text-sm mt-1">
                  {settings?.footerCtaSubtitle || 'جرّب مكتشف الهدايا الذكي للحصول على اقتراحات تلائم ذوقك وميزانيتك بدقة'}
                </p>
              </div>
              <Link
                href={settings?.footerCtaBtnLink || '/gift-finder'}
                className="flex items-center gap-2 h-12 px-7 rounded-2xl font-black text-[#1C1917] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(201,169,110,0.4)] shrink-0 text-sm"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
              >
                <span>{settings?.footerCtaBtnText || 'جرّب مكتشف الهدايا'}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          {/* Brand & About */}
          <div className="space-y-4 lg:col-span-1 text-start">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              {settings?.logoUrl ? (
                <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md">
                  <Image src={settings.logoUrl} alt={storeName} fill className="object-cover" />
                </div>
              ) : (
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                >
                  <Gift className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex flex-col text-start">
                <span className="text-xl font-black text-white tracking-tight">
                  {storeName.split('|')[0].trim()}
                </span>
                <span className="text-[10px] font-bold text-[#C9A96E] tracking-widest">
                  {storeName.includes('|') ? storeName.split('|')[1].trim() : 'GIFTY PLUS'}
                </span>
              </div>
            </Link>
            
            <p className="text-[#C9A96E] font-extrabold text-xs">{storeSlogan}</p>
            
            <p className="text-white/50 leading-relaxed text-xs sm:text-sm">
              {storeDesc}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
                title="واتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إنستغرام"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
                  title="إنستغرام"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              )}

              {settings?.telegramUrl && (
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيليغرام"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
                  title="تيليغرام"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}

              <a
                href={`mailto:${storeEmail}`}
                aria-label="إيميل"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
                title="البريد الإلكتروني"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-start">
            <h3 className="font-black text-white mb-4 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
              روابط سريعة
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-white/50 hover:text-[#C9A96E] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#C9A96E] transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="text-xs text-white/30 hover:text-[#C9A96E] transition-colors inline-flex items-center gap-1"
                >
                  <span>لوحة إدارة المتجر</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-start">
            <h3 className="font-black text-white mb-4 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
              أقسام الهدايا
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.categories.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-white/50 hover:text-[#C9A96E] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#C9A96E] transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Payment */}
          <div className="text-start">
            <h3 className="font-black text-white mb-4 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
              خدمة العملاء والتوصيل
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-white/50">
                <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                <span>{storeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-white/50">
                <Phone className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span dir="ltr">{storePhone}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-white/50">
                <Mail className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>{storeEmail}</span>
              </li>
            </ul>

            {/* Payment & Security Badge */}
            <div className="mt-5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[11px] font-bold text-[#C9A96E] mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                طرق دفع متعددة وآمنة
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-white/60">
                <span className="px-2 py-0.5 rounded-md bg-white/10">الدفع عند الاستلام</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10">زين كاش</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10">FIB</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10">MasterCard / Visa</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
          <p className="text-xs text-white/40">
            {settings?.copyrightText || '© 2026 گِفتي بلس | Gifty Plus. جميع الحقوق محفوظة.'}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-[#C9A96E] transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-[#C9A96E] transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
