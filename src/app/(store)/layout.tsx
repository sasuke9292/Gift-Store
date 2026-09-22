import React from 'react'
import { StoreHeader } from '@/components/layout/store-header'
import { StoreFooter } from '@/components/layout/store-footer'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AlertCircle, Clock, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  try {
    session = await auth()
  } catch (error) {
    console.error('Failed to get session:', error)
  }

  let settings = null
  try {
    settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } })
  } catch (error) {
    console.error('Failed to fetch store settings:', error)
  }

  const isStaff = session?.user?.role && session.user.role !== 'CUSTOMER'

  // Maintenance Mode screen for regular visitors
  if (settings?.maintenanceMode && !isStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1C1917] text-white px-4 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-3xl bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-[#C9A96E] animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          {settings.storeName || 'گفتي بلس'} في وضع التحديث
        </h1>
        <p className="text-white/70 max-w-md mx-auto text-sm sm:text-base leading-relaxed mb-8">
          {settings.maintenanceMessage || 'المتجر في وضع الصيانة والتحديث حالياً، سنعود إليكم قريباً بأجمل العروض!'}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/admin-login"
            className="text-xs text-[#C9A96E] hover:underline"
          >
            دخول المشرفين والإدارة
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] pb-16 lg:pb-0">
      {settings?.maintenanceMode && isStaff && (
        <div className="bg-amber-500 text-black py-1.5 px-4 text-center text-xs font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>وضع الصيانة مفعّل حالياً: المتجر مغلق أمام الزوار العاديين وأنت تتصفحه بصفتك مديراً.</span>
        </div>
      )}
      <StoreHeader user={session?.user} topBarText={settings?.topBarText} settings={settings} />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter settings={settings} />
      <MobileBottomNav />
    </div>
  )
}
