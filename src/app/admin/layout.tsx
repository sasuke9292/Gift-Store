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
    <div className="min-h-screen bg-[#FBFBFD] flex font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* Sidebar - Desktop */}
      <AdminSidebar storeName={settings?.storeName} logoUrl={settings?.logoUrl} user={session?.user} />
      
      {/* Main Content - uses padding to avoid overlap with fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ps-72 transition-all duration-300">
        <AdminHeader userRole={session?.user?.role} userName={session?.user?.name} />
        
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden relative">
          {/* Subtle Decorative Background Element for Content Area */}
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-slate-100 to-transparent -z-10 pointer-events-none" />
          
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
