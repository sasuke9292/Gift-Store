import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { TrackOrderClient } from './track-order-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'تتبع الطلب مباشرة | گفتي بلس',
  description: 'تتبع حالة طلبك من گفتي بلس في الوقت الفعلي برقم الطلب أو رقم الهاتف'
}

export default async function TrackOrderPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null)

  return (
    <TrackOrderClient 
      storePhone={settings?.storePhone}
      storeName={settings?.storeName || 'گفتي بلس'}
      whatsappNumber={settings?.whatsappNumber}
    />
  )
}

