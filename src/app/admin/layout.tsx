import React from 'react'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'
import { getStoreSettings } from '@/app/actions/admin/settings'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getStoreSettings()
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/admin-login')
  }

  if (session.user.role === 'CUSTOMER') {
    redirect('/')
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <AdminSidebar storeName={settings?.storeName} logoUrl={settings?.logoUrl} user={session?.user} />
      
      {/* Main Content - uses padding to avoid overlap with fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ps-72 transition-all duration-300">
        <AdminHeader userRole={session?.user?.role} userName={session?.user?.name} />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

