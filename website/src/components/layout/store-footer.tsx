import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Share2, 
  Gift, 
  ArrowLeft, 
  Send, 
  Lock,
  Sparkles
} from 'lucide-react'

const footerLinks = {
  quickLinks: [
    { href: '/shop', label: 'المتجر الإلكتروني' },
    { href: '/gift-finder', label: 'مكتشف الهدايا' },
    { href: '/track-order', label: 'تتبع الطلب' },
    { href: '/faq', label: 'الأسئلة الشائعة' },
    { href: '/contact', label: 'تواصل معنا' },
  ],
  categories: [
    { href: '/category/men', label: 'هدايا رجالية' },
    { href: '/category/women', label: 'هدايا نسائية' },
    { href: '/category/occasions', label: 'بوكسات وتغليف' },
    { href: '/category/custom', label: 'هدايا مخصصة' },
    { href: '/category/offers', label: 'العروض والتخفيضات' },
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
    footerCtaBadge?: string
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
  const storeDesc = settings?.storeDescription || 'الوجهة الأولى لاختيار وتنسيق الهدايا الفاخرة في العراق • تغليف ملكي وتوصيل سريع لكافة المحافظات.'
  const storePhone = settings?.storePhone || '+964 770 123 4567'
  const storeEmail = settings?.storeEmail || 'info@giftstore.iq'
  
  const rawWa = settings?.whatsappNumber || '9647700000000'
  const whatsappHref = rawWa.startsWith('http') 
    ? rawWa 
    : `https://wa.me/${rawWa.replace(/[^0-9]/g, '')}`

  const showCta = settings?.showFooterCta ?? true

  return (
    <footer className="bg-[#0c1424] text-white/80 relative overflow-hidden text-start" dir="rtl">
      {/* Subtle royal navy glow background effects */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#22385e]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-80 h-80 bg-[#13213c]/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Optional Top CTA Banner (Compact & Responsive) */}
      {showCta && (
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-center sm:text-start">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#7ea6e6] mb-0.5 sm:mb-1">
                  <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {settings?.footerCtaBadge || 'خدمة استثنائية لكافة المناسبات'}
                </span>
                <h3 className="text-base sm:text-2xl font-black text-white">
                  {settings?.footerCtaTitle || 'هل تبحث عن هدية لا تُنسى؟'}
                </h3>
                <p className="text-white/50 text-[11px] sm:text-sm mt-0.5 line-clamp-1 sm:line-clamp-none">
                  {settings?.footerCtaSubtitle || 'جرّب مكتشف الهدايا الذكي للحصول على اقتراحات تلائم ذوقك وميزانيتك بدقة'}
                </p>
              </div>
              <Link
                href={settings?.footerCtaBtnLink || '/gift-finder'}
                className="flex items-center justify-center gap-2 h-9 sm:h-11 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-black text-white border border-[#3b5e94]/40 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(19,33,60,0.6)] shrink-0 text-xs sm:text-sm w-full sm:w-auto"
                style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
              >
                <span>{settings?.footerCtaBtnText || 'جرّب مكتشف الهدايا'}</span>
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Decluttered & Compact Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 mb-6 sm:mb-10">

          {/* Col 1: Brand & Slogan & Socials (4 Cols on Desktop) */}
          <div className="lg:col-span-4 space-y-2.5 sm:space-y-4 text-start">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group w-fit">
              {settings?.logoUrl ? (
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                  <Image src={settings.logoUrl} alt={storeName} fill className="object-cover" />
                </div>
              ) : (
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md border border-[#3b5e94]/30"
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
              <div className="flex flex-col text-start">
                <span className="text-lg sm:text-xl font-black text-white leading-tight">
                  {storeName.split('|')[0].trim()}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#7ea6e6] tracking-widest mt-0.5">
                  {storeName.includes('|') ? storeName.split('|')[1].trim() : 'GIFTY PLUS'}
                </span>
              </div>
            </Link>
            
            <div className="flex items-center gap-1.5 text-[#7ea6e6] font-bold text-[11px] sm:text-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#7ea6e6] shrink-0" />
              <span>{storeSlogan.replace(/[✨*]/g, '').trim()}</span>
            </div>
            
            <p className="text-white/60 leading-relaxed text-[11px] sm:text-xs max-w-sm line-clamp-2 sm:line-clamp-none">
              {storeDesc}
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2 pt-0.5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7ea6e6] hover:bg-white/10 hover:border-[#5c8fd6]/40 transition-all"
                title="واتساب"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>

              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إنستغرام"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7ea6e6] hover:bg-white/10 hover:border-[#5c8fd6]/40 transition-all"
                  title="إنستغرام"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}

              {settings?.telegramUrl && (
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيليغرام"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7ea6e6] hover:bg-white/10 hover:border-[#5c8fd6]/40 transition-all"
                  title="تيليغرام"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}

              <a
                href={`mailto:${storeEmail}`}
                aria-label="إيميل"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7ea6e6] hover:bg-white/10 hover:border-[#5c8fd6]/40 transition-all"
                title="البريد الإلكتروني"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 & 3: Categories & Quick Links (Side-by-side 2 Columns on Mobile!) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6 text-start">
            {/* Categories */}
            <div>
              <h3 className="font-extrabold text-white mb-2 sm:mb-4 text-xs flex items-center gap-1.5 sm:gap-2" dir="rtl">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5c8fd6] shrink-0" />
                <span>أقسام الهدايا</span>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2.5">
                {footerLinks.categories.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[11px] sm:text-xs text-white/60 hover:text-[#7ea6e6] hover:-translate-x-0.5 transition-all inline-block font-medium py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-extrabold text-white mb-2 sm:mb-4 text-xs flex items-center gap-1.5 sm:gap-2" dir="rtl">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5c8fd6] shrink-0" />
                <span>روابط سريعة</span>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2.5">
                {footerLinks.quickLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[11px] sm:text-xs text-white/60 hover:text-[#7ea6e6] hover:-translate-x-0.5 transition-all inline-block font-medium py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4: Customer Care & Direct Contacts (2 Columns on Mobile!) */}
          <div className="lg:col-span-3 text-start space-y-2 sm:space-y-4">
            <h3 className="font-extrabold text-white text-xs mb-2 sm:mb-4 flex items-center gap-1.5 sm:gap-2" dir="rtl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5c8fd6] shrink-0" />
              <span>خدمة العملاء</span>
            </h3>

            {/* Direct Clickable Contacts (Side by Side on mobile!) */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
              <a 
                href={whatsappHref} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#3b5e94]/50 transition-all group min-w-0"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#22385e]/50 border border-[#3b5e94]/30 flex items-center justify-center text-[#7ea6e6] shrink-0 group-hover:scale-105 transition-all">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex flex-col text-start min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[11px] text-white/50 font-medium truncate">
                    واتساب وهاتف
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-white/90 group-hover:text-[#7ea6e6] truncate tracking-tight" dir="ltr">
                    {storePhone}
                  </span>
                </div>
              </a>

              <a 
                href={`mailto:${storeEmail}`} 
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#3b5e94]/50 transition-all group min-w-0"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#22385e]/50 border border-[#3b5e94]/30 flex items-center justify-center text-[#7ea6e6] shrink-0 group-hover:scale-105 transition-all">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex flex-col text-start min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[11px] text-white/50 font-medium truncate">
                    البريد الإلكتروني
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-white/90 group-hover:text-[#7ea6e6] truncate" dir="ltr">
                    {storeEmail}
                  </span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Clean, Elegant Bottom Bar (with safe-bottom padding for mobile navigation) */}
        <div className="border-t border-white/10 pt-4 pb-20 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-center sm:text-start">
          <p className="text-[10px] sm:text-[11px] text-white/40">
            {settings?.copyrightText || '© 2026 گِفتي بلس | Gifty Plus. جميع الحقوق محفوظة.'}
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-white/40">
            <Link href="/privacy" className="hover:text-[#7ea6e6] transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/terms" className="hover:text-[#7ea6e6] transition-colors">
              الشروط والأحكام
            </Link>
            <span className="text-white/20">•</span>
            <Link 
              href="/admin" 
              className="hover:text-[#7ea6e6] transition-colors inline-flex items-center gap-1 opacity-70 hover:opacity-100"
              title="دخول لوحة الإدارة"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>لوحة الإدارة</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
