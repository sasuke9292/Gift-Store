import React from 'react'
import { StoreHeader } from '@/components/layout/store-header'
import { StoreFooter } from '@/components/layout/store-footer'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] pb-16 lg:pb-0">
      <StoreHeader user={session?.user} topBarText={settings?.topBarText} />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  )
}
