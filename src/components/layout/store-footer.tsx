import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Link as LinkIcon, Share2 } from 'lucide-react'

export function StoreFooter() {
  return (
    <footer className="bg-[#010306] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#050B14] font-bold text-xl shadow-lg bg-gradient-to-tr from-amber-200 to-yellow-600 transition-transform group-hover:scale-105">
                G
              </div>
              <span className="text-2xl font-black text-white tracking-tight">گفتي بلس</span>
            </Link>
            <p className="text-amber-300 font-bold mb-2">خلّي هديتك تحچي عنك</p>
            <p className="text-slate-400 leading-relaxed text-sm">
              الوجهة الأولى لاختيار الهدايا الراقية في العراق. نوفر لك تشكيلة واسعة من الهدايا المميزة لكل المناسبات مع خدمة توصيل سريعة وتغليف فاخر.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-300 hover:text-amber-400 hover:bg-white/10 transition-all shadow-md">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-300 hover:text-amber-400 hover:bg-white/10 transition-all shadow-md">
                <LinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg tracking-wide">روابط سريعة</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">من نحن</Link></li>
              <li><Link href="/shop" className="hover:text-amber-400 transition-colors">المتجر</Link></li>
              <li><Link href="/track-order" className="hover:text-amber-400 transition-colors">تتبع طلبك</Link></li>
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">اتصل بنا</Link></li>
              <li className="pt-2">
                <Link href="/admin" className="hover:text-rose-400 transition-colors font-bold text-rose-500/80">دخول الإدارة (لوحة التحكم)</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg tracking-wide">الأقسام</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/category/men" className="hover:text-amber-400 transition-colors">هدايا رجالية</Link></li>
              <li><Link href="/category/women" className="hover:text-amber-400 transition-colors">هدايا نسائية</Link></li>
              <li><Link href="/category/kids" className="hover:text-amber-400 transition-colors">هدايا أطفال</Link></li>
              <li><Link href="/category/occasions" className="hover:text-amber-400 transition-colors">هدايا المناسبات</Link></li>
              <li><Link href="/custom-gifts" className="hover:text-amber-400 transition-colors">هدايا مخصصة</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg tracking-wide">تواصل معنا</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 drop-shadow-md" />
                <span>بغداد، المنصور، شارع 14 رمضان</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 drop-shadow-md" />
                <span dir="rtl">+964 770 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 drop-shadow-md" />
                <span>info@giftstore.iq</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 گفتي بلس. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
