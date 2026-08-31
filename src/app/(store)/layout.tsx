import React from 'react'
import { StoreHeader } from '@/components/layout/store-header'
import { StoreFooter } from '@/components/layout/store-footer'
import { auth } from '@/auth'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader user={session?.user} />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  )
}
