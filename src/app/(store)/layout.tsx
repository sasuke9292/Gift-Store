import React from 'react'
import { StoreHeader } from '@/components/layout/store-header'
import { StoreFooter } from '@/components/layout/store-footer'
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
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <StoreHeader user={session?.user} topBarText={settings?.topBarText} />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  )
}
