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
    if (window.innerWidth < 1280) {
      setIsCollapsed(true)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#060D1A] flex font-sans" dir="rtl">
        <div className="w-72 hidden lg:block border-e border-white/5 bg-[#030810]" />
        <div className="flex-1 flex flex-col min-w-0 lg:ps-72">
          <div className="h-16 bg-[#060D1A]/95 border-b border-white/5" />
          <main className="flex-1 p-6" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060D1A] flex font-sans selection:bg-amber-500/30 selection:text-amber-200" dir="rtl">
      {/* Sidebar - Desktop */}
      <AdminSidebar 
        storeName={settings?.storeName} 
        logoUrl={settings?.logoUrl} 
        user={user} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:ps-20" : "lg:ps-72"
      )}>
        <AdminHeader userRole={user?.role} userName={user?.name} />
        
        <main className="flex-1 p-5 md:p-7 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
