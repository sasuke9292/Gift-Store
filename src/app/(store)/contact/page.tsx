import { Mail, Phone, Truck, Clock, MessageCircle } from 'lucide-react'
import { ContactForm } from './contact-form'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null)

  const phone = settings?.storePhone || '+964 770 123 4567'
  const email = settings?.storeEmail || 'info@giftstore.iq'
  const workingHours = settings?.workingHours || 'السبت – الخميس: 9:00 صباحاً – 10:00 مساءً'

  const contactItems = [
    {
      icon: Phone,
      title: 'الهاتف وخدمة العملاء',
      value: phone,
      desc: 'متاح للاتصال والاستفسار المباشر عبر واتساب وهاتفياً',
      href: `tel:${phone.replace(/\s+/g, '')}`,
      color: '#C9A96E',
      bg: '#FBF6EE'
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: email,
      desc: 'نرد خلال 24 ساعة كحد أقصى',
      href: `mailto:${email}`,
      color: '#6366F1',
      bg: '#F5F3FF'
    },
    {
      icon: Truck,
      title: 'طبيعة المتجر والتوصيل',
      value: 'متجر إلكتروني 100% (أونلاين)',
      desc: 'خدمة التوصيل السريع لباب بيتك لكافة محافظات العراق',
      href: '#',
      color: '#E85D75',
      bg: '#FDF2F4'
    },
    {
      icon: Clock,
      title: 'أوقات وساعات العمل',
      value: workingHours,
      desc: 'فريقنا جاهز لخدمتكم طوال الأسبوع',
      href: '#',
      color: '#10B981',
      bg: '#F0FDF9'
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20" dir="rtl">
      <section className="relative bg-[#1C1917] text-white py-24 px-4 overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/25 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-[#C9A96E]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">اتصل بنا</h1>
          <p className="text-white/60 text-lg">فريق {settings?.storeName?.split('|')[0] || 'گفتي بلس'} مستعد لمساعدتك في أي وقت</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Contact Methods */}
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-[#1C1917] mb-6">طرق التواصل معنا</h2>

            {contactItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-[#E8E4DF] hover:border-[#C9A96E]/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-all duration-200 group block text-start"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: item.bg }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#A8A29E] mb-0.5">{item.title}</p>
                  <p className="font-bold text-[#1C1917]" dir="ltr">{item.value}</p>
                  <p className="text-sm text-[#78716C]">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Quick Message Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
