import Link from 'next/link'
import { Info, Heart, Star, ArrowLeft, Users, Award, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'من نحن | گفتي بلس',
  description: 'اكتشف قصة گفتي بلس — الوجهة الأولى للهدايا الراقية في العراق'
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">

      {/* Hero */}
      <section className="relative bg-[#1C1917] text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #C9A96E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/25 flex items-center justify-center mx-auto mb-6">
            <Info className="w-8 h-8 text-[#C9A96E]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">من نحن</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">قصتنا مع الهدايا التي تصنع الفارق</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Mission */}
        <div className="bg-white rounded-3xl border border-[#E8E4DF] p-10 mb-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
          <h2 className="text-2xl font-black text-[#1C1917] mb-4">رسالتنا</h2>
          <p className="text-[#78716C] leading-loose text-lg">
            في <span className="font-bold text-[#C9A96E]">گفتي بلس</span>، نؤمن أن كل هدية تحمل قصة وتعبّر عن مشاعر لا تُقال بالكلمات.
            لذلك جعلنا مهمتنا أن نقدّم لك تجربة تسوق استثنائية تجمع بين التنوع والجودة والأناقة — لأن كل لحظة تستحق أن تُحتفل بها بأفضل طريقة.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Heart, title: 'بكل محبة', desc: 'نختار كل منتج بعناية لنضمن أنه يحمل قيمة حقيقية ويعبّر عن المشاعر بأجمل صورة.', color: '#E85D75', bg: '#FDF2F4' },
            { icon: Award, title: 'جودة بلا تنازل', desc: 'كل منتج يمر بمعايير صارمة للجودة قبل وصوله إليك لضمان رضاك التام.', color: '#C9A96E', bg: '#FBF6EE' },
            { icon: Shield, title: 'ثقة وأمان', desc: 'نحرص على بناء علاقة ثقة مع كل عميل من خلال الشفافية والنزاهة في كل تعامل.', color: '#10B981', bg: '#F0FDF9' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-[#E8E4DF] p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: item.bg }}>
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <h3 className="font-black text-[#1C1917] text-lg mb-2">{item.title}</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-[#1C1917] rounded-3xl p-10 text-white text-center mb-8">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: '500+', label: 'منتج متاح' },
              { value: '12K+', label: 'عميل سعيد' },
              { value: '4.9 ★', label: 'متوسط التقييم' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-[#C9A96E]">{stat.value}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
          >
            تسوق الآن
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
