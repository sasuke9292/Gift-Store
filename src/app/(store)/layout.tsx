import React from 'react'
import { StoreHeader } from '@/components/layout/store-header'
import { StoreFooter } from '@/components/layout/store-footer'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader user={session?.user} topBarText={settings?.topBarText} />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  )
}
