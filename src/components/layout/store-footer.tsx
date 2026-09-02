import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Link as LinkIcon, Share2 } from 'lucide-react'

export function StoreFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                G
              </div>
              <span className="text-2xl font-bold text-slate-800">گفتي بلس</span>
            </Link>
            <p className="text-slate-700 font-bold mb-2">خلّي هديتك تحچي عنك</p>
            <p className="text-slate-500 leading-relaxed text-sm">
              الوجهة الأولى لاختيار الهدايا الراقية في العراق. نوفر لك تشكيلة واسعة من الهدايا المميزة لكل المناسبات مع خدمة توصيل سريعة وتغليف فاخر.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors">
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-800 mb-6 text-lg">روابط سريعة</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">المتجر</Link></li>
              <li><Link href="/track-order" className="hover:text-primary transition-colors">تتبع طلبك</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
              <li className="pt-2">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors font-bold text-indigo-500">دخول الإدارة (لوحة التحكم)</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-slate-800 mb-6 text-lg">الأقسام</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/category/men" className="hover:text-primary transition-colors">هدايا رجالية</Link></li>
              <li><Link href="/category/women" className="hover:text-primary transition-colors">هدايا نسائية</Link></li>
              <li><Link href="/category/kids" className="hover:text-primary transition-colors">هدايا أطفال</Link></li>
              <li><Link href="/category/occasions" className="hover:text-primary transition-colors">هدايا المناسبات</Link></li>
              <li><Link href="/custom-gifts" className="hover:text-primary transition-colors">هدايا مخصصة</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-slate-800 mb-6 text-lg">تواصل معنا</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>بغداد، المنصور، شارع 14 رمضان</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr">+964 770 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@giftstore.iq</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 گفتي بلس. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-primary">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
