import { HelpCircle, ChevronDown, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة | گفتي بلس',
  description: 'إجابات على أكثر الأسئلة شيوعاً حول متجر گفتي بلس'
}

const faqs = [
  {
    q: 'كيف يمكنني تتبع طلبي؟',
    a: 'بعد تأكيد الطلب، ستحصل على رقم تأكيد عبر الهاتف. يمكنك التواصل معنا مباشرة على الرقم المدرج في موقعنا لمتابعة حالة طلبك.'
  },
  {
    q: 'ما هي سياسة الاسترجاع؟',
    a: 'يمكنك إرجاع أي منتج خلال 7 أيام من تاريخ الاستلام شرط أن يكون في حالته الأصلية وبتغليفه الأصلي. يتم استرداد المبلغ خلال 3-5 أيام عمل.'
  },
  {
    q: 'هل التوصيل مجاني؟',
    a: 'نعم، التوصيل مجاني لجميع الطلبات التي تتجاوز 100,000 د.ع. للطلبات الأقل من ذلك، رسوم الشحن 5,000 د.ع فقط.'
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    a: 'حالياً ندعم الدفع عند الاستلام (كاش)، ونعمل على إضافة خيارات دفع إلكتروني قريباً.'
  },
  {
    q: 'هل يمكنني تخصيص الهدية أو إضافة رسالة؟',
    a: 'بالتأكيد! يمكنك طلب تغليف فاخر وإضافة بطاقة هدية مخصصة برسالتك الخاصة عند إتمام الطلب.'
  },
  {
    q: 'كم يستغرق وقت التوصيل؟',
    a: 'عادةً يصل طلبك خلال 24-48 ساعة داخل بغداد، و3-5 أيام عمل للمحافظات الأخرى.'
  },
  {
    q: 'هل المنتجات أصلية ومضمونة؟',
    a: 'جميع منتجاتنا أصلية 100% وتمر بفحص دقيق للجودة قبل وصولها إليك. نضمن جودة كل منتج.'
  },
  {
    q: 'كيف أتواصل مع خدمة العملاء؟',
    a: 'يمكنك التواصل معنا عبر الهاتف على الرقم +964 770 123 4567 أو من خلال صفحة "اتصل بنا" في الموقع.'
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      <section className="relative bg-[#0c1424] text-white py-24 px-4 overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#22385e]/25 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#22385e]/40 border border-[#3b5e94]/40 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-[#7ea6e6]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">الأسئلة الشائعة</h1>
          <p className="text-white/60 text-lg">إجابات سريعة على أسئلتك الأكثر شيوعاً</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="space-y-4 mb-10">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-2xl border border-[#E8E4DF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-[#1C1917] list-none hover:bg-[#FAFAF8] transition-colors">
                <span>{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-[#A8A29E] transition-transform group-open:rotate-180 shrink-0 ms-4" />
              </summary>
              <div className="px-6 pb-6 pt-1 text-[#78716C] leading-relaxed border-t border-[#E8E4DF]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="bg-[#F0F4F9] border border-[#13213c]/20 rounded-2xl p-8 text-center">
          <h3 className="font-black text-[#1C1917] text-xl mb-2">لم تجد إجابة لسؤالك؟</h3>
          <p className="text-[#78716C] mb-5">فريق دعمنا مستعد للمساعدة على مدار الساعة</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 h-11 px-7 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            اتصل بنا
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
