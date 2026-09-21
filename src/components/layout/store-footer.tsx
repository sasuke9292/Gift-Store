import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Gift, ArrowLeft } from 'lucide-react'

const footerLinks = {
  quickLinks: [
    { href: '/about', label: 'من نحن' },
    { href: '/shop', label: 'المتجر' },
    { href: '/gift-finder', label: 'مكتشف الهدايا' },
    { href: '/track-order', label: 'تتبع طلبك' },
    { href: '/faq', label: 'الأسئلة الشائعة' },
    { href: '/contact', label: 'اتصل بنا' },
  ],
  categories: [
    { href: '/category/men', label: 'هدايا رجالية' },
    { href: '/category/women', label: 'هدايا نسائية' },
    { href: '/category/kids', label: 'هدايا أطفال' },
    { href: '/category/occasions', label: 'هدايا المناسبات' },
    { href: '/custom-gifts', label: 'هدايا مخصصة' },
    { href: '/category/offers', label: 'عروض وتخفيضات' },
  ],
}

export function StoreFooter() {
  return (
    <footer className="bg-[#1C1917] text-white/80 relative overflow-hidden">
      {/* Subtle warm glow */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#C9A96E]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-64 h-64 bg-[#E85D75]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-start">
              <h3 className="text-2xl font-black text-white mb-2">هل تبحث عن الهدية المثالية؟</h3>
              <p className="text-white/50 text-sm">جرّب مكتشف الهدايا الذكي للحصول على توصيات مخصصة لك</p>
            </div>
            <Link
              href="/gift-finder"
              className="flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-[#1C1917] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(201,169,110,0.4)] flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
            >
              <Gift className="w-4 h-4" />
              جرّب المكتشف
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}>
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">گفتي بلس</span>
            </Link>
            <p className="text-[#C9A96E] font-bold text-sm">خلّي هديتك تحچي عنك</p>
            <p className="text-white/45 leading-relaxed text-sm">
              الوجهة الأولى لاختيار الهدايا الراقية في العراق. تشكيلة واسعة لكل المناسبات مع توصيل سريع وتغليف فاخر.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A96E] hover:bg-white/10 hover:border-[#C9A96E]/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black text-white mb-5 text-sm uppercase tracking-widest">روابط سريعة</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 hover:text-[#C9A96E] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9A96E]/40 group-hover:bg-[#C9A96E] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="text-xs text-white/25 hover:text-white/40 transition-colors"
                >
                  لوحة الإدارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-black text-white mb-5 text-sm uppercase tracking-widest">الأقسام</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 hover:text-[#C9A96E] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9A96E]/40 group-hover:bg-[#C9A96E] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-black text-white mb-5 text-sm uppercase tracking-widest">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/45">
                <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                <span>بغداد، المنصور، شارع 14 رمضان</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/45">
                <Phone className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span dir="rtl">+964 770 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/45">
                <Mail className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>info@giftstore.iq</span>
              </li>
            </ul>

            {/* Working Hours */}
            <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">أوقات العمل</p>
              <p className="text-sm text-white/60 font-medium">السبت – الخميس</p>
              <p className="text-sm text-[#C9A96E] font-bold">9 صباحاً – 9 مساءً</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2026 گفتي بلس. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
