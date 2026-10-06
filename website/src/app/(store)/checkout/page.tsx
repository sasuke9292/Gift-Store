import type { Metadata } from 'next'
import CheckoutClient from './checkout-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'إتمام الطلب | گِفتي بلس',
  description: 'أكمل طلب هديتك الفاخرة بسهولة مع خدمة التغليف الملكي المجاني والتأكيد المباشر عبر WhatsApp',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
