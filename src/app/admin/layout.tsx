import React from 'react'
import { getStoreSettings } from '@/app/actions/admin/settings'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from './admin-layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/admin-login')
  }

  if (session.user.role === 'CUSTOMER') {
    redirect('/')
  }

  const settings = await getStoreSettings()
  
  return (
    <AdminLayoutClient settings={settings} user={session?.user}>
      {children}
    </AdminLayoutClient>
  )
}
