'use client'

import React, { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'
import { cn } from '@/lib/utils'

export function AdminLayoutClient({
  children,
  settings,
  user
}: {
  children: React.ReactNode
  settings: any
  user: any
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Optional: check localStorage or window width to auto-collapse
    if (window.innerWidth < 1280) {
      setIsCollapsed(true)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex font-sans" dir="rtl">
        <div className="w-72 hidden lg:block border-e border-white/5 bg-[#050B14]" />
        <div className="flex-1 flex flex-col min-w-0 lg:ps-72">
          <div className="h-20 bg-white/70 border-b border-slate-100" />
          <main className="flex-1 p-6 md:p-10" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex font-sans selection:bg-amber-500/20 selection:text-amber-900" dir="rtl">
      {/* Sidebar - Desktop */}
      <AdminSidebar 
        storeName={settings?.storeName} 
        logoUrl={settings?.logoUrl} 
        user={user} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      {/* Main Content - uses padding to avoid overlap with fixed sidebar */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:ps-20" : "lg:ps-72"
      )}>
        <AdminHeader userRole={user?.role} userName={user?.name} />
        
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
