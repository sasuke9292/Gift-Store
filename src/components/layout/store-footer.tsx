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
  Lock 
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
    <footer className="bg-[#1C1917] text-white/80 relative overflow-hidden text-start" dir="rtl">
      {/* Subtle warm glow background effects */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#C9A96E]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-80 h-80 bg-[#E85D75]/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Optional Top CTA Banner */}
      {showCta && (
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96E] mb-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  {settings?.footerCtaBadge || 'خدمة استثنائية لكافة المناسبات'}
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
                className="flex items-center gap-2 h-11 px-6 rounded-2xl font-black text-[#1C1917] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(201,169,110,0.4)] shrink-0 text-xs sm:text-sm"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
              >
                <span>{settings?.footerCtaBtnText || 'جرّب مكتشف الهدايا'}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Decluttered Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">

          {/* Col 1: Brand & Slogan & Socials (4 Cols) */}
          <div className="lg:col-span-4 space-y-3.5 text-start">
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
            
            <p className="text-[#C9A96E] font-bold text-xs">{storeSlogan}</p>
            
            <p className="text-white/50 leading-relaxed text-xs max-w-sm">
              {storeDesc}
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
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
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
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
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
                  title="تيليغرام"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}

              <a
                href={`mailto:${storeEmail}`}
                aria-label="إيميل"
                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/40 transition-all"
                title="البريد الإلكتروني"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories (2.5 Cols) */}
          <div className="lg:col-span-2 text-start">
            <h3 className="font-black text-white mb-3 text-xs tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
              أقسام الهدايا
            </h3>
            <ul className="space-y-2">
              {footerLinks.categories.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/50 hover:text-[#C9A96E] hover:-translate-x-0.5 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links (2.5 Cols) */}
          <div className="lg:col-span-2 text-start">
            <h3 className="font-black text-white mb-3 text-xs tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/50 hover:text-[#C9A96E] hover:-translate-x-0.5 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Customer Care & Direct Contacts (3.5 Cols) */}
          <div className="lg:col-span-4 text-start space-y-4">
            <h3 className="font-black text-white text-xs tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
              خدمة العملاء
            </h3>

            {/* Direct Clickable Contacts */}
            <div className="space-y-2.5">
              <a 
                href={whatsappHref} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2.5 text-xs text-white/60 hover:text-[#C9A96E] transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E] shrink-0 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">الطلب عبر واتساب والهاتف</span>
                  <span className="font-bold text-white/80 group-hover:text-[#C9A96E]" dir="ltr">{storePhone}</span>
                </div>
              </a>

              <a 
                href={`mailto:${storeEmail}`} 
                className="flex items-center gap-2.5 text-xs text-white/60 hover:text-[#C9A96E] transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E] shrink-0 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">البريد الإلكتروني للدعم</span>
                  <span className="font-bold text-white/80 group-hover:text-[#C9A96E]">{storeEmail}</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Clean, Elegant Bottom Bar */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
          <p className="text-[11px] text-white/40">
            {settings?.copyrightText || '© 2026 گِفتي بلس | Gifty Plus. جميع الحقوق محفوظة.'}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[11px] text-white/40 hover:text-[#C9A96E] transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-[11px] text-white/40 hover:text-[#C9A96E] transition-colors">
              الشروط والأحكام
            </Link>
            <Link 
              href="/admin" 
              className="text-[11px] text-white/20 hover:text-[#C9A96E] transition-colors inline-flex items-center gap-1"
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
