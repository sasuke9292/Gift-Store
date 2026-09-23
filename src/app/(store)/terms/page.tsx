import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الشروط والأحكام | گفتي بلس',
  description: 'شروط وأحكام استخدام متجر گفتي بلس'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      <section className="relative bg-[#0c1424] text-white py-24 px-4 overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#22385e]/25 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#22385e]/40 border border-[#3b5e94]/40 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-[#7ea6e6]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">الشروط والأحكام</h1>
          <p className="text-white/60">آخر تحديث: سبتمبر 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-[#E8E4DF] p-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)] space-y-8">
          <p className="text-[#78716C] leading-loose border-b border-[#E8E4DF] pb-6">
            بالوصول إلى موقع گفتي بلس واستخدامه، فأنت توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية.
          </p>

          {[
            {
              title: 'الاستخدام المقبول',
              content: 'يُسمح باستخدام الموقع للأغراض الشخصية وغير التجارية فقط. يُمنع أي استخدام غير قانوني أو ضار أو مزعزع لأمن الموقع أو خدماته.'
            },
            {
              title: 'الطلبات والأسعار',
              content: 'الأسعار المدرجة بالدينار العراقي وتشمل الضريبة. نحتفظ بالحق في تعديل الأسعار في أي وقت دون إشعار مسبق. الأسعار النهائية هي تلك المؤكدة وقت الطلب.'
            },
            {
              title: 'التوصيل',
              content: 'نسعى لتوصيل طلبك في المدة المحددة، لكننا لا نتحمل مسؤولية التأخيرات الناجمة عن ظروف خارجة عن إرادتنا كالطقس أو الأحداث الاستثنائية.'
            },
            {
              title: 'الاسترجاع والاستبدال',
              content: 'يحق لك إرجاع المنتج خلال 7 أيام من الاستلام إذا كان معيباً أو مختلفاً عن المطلوب. لا يُقبل الإرجاع للمنتجات المخصصة أو التي تم فتح تغليفها.'
            },
            {
              title: 'الملكية الفكرية',
              content: 'جميع المحتويات على الموقع من نصوص وصور وشعارات هي ملكية حصرية لگفتي بلس ومحمية بقوانين حقوق الملكية الفكرية. يُمنع نسخها أو إعادة استخدامها دون إذن.'
            },
            {
              title: 'تحديد المسؤولية',
              content: 'لا تتجاوز مسؤوليتنا في أي حال قيمة الطلب المدفوع. نحن غير مسؤولين عن أي أضرار غير مباشرة أو عرضية ناجمة عن استخدام منتجاتنا أو خدماتنا.'
            },
            {
              title: 'تعديل الشروط',
              content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التعديلات على هذه الصفحة مع تحديث تاريخ آخر مراجعة.'
            },
            {
              title: 'القانون المطبق',
              content: 'تخضع هذه الشروط لقوانين جمهورية العراق. أي نزاع يُحل بالطرق الودية أولاً، ثم بالإجراءات القانونية المعتمدة.'
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-black text-[#1C1917] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#13213c] inline-block" />
                {section.title}
              </h2>
              <p className="text-[#78716C] leading-loose">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
