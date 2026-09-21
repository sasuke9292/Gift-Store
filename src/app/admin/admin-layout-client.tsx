'use client'

import React, { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/use-mounted'

export function AdminLayoutClient({
  children,
  settings,
  user
}: {
  children: React.ReactNode
  settings: any
  user: any
}) {
  const mounted = useMounted()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1280
    }
    return false
  })

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1279px)')
    const onChange = (e: MediaQueryListEvent) => {
      setIsCollapsed(e.matches)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex font-sans" dir="rtl">
        <div className="w-64 hidden lg:block border-e border-[#E8E4DF] bg-white" />
        <div className="flex-1 flex flex-col min-w-0 lg:ps-64">
          <div className="h-16 bg-white border-b border-[#E8E4DF]" />
          <main className="flex-1 p-5 md:p-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans text-[#1C1917] selection:bg-[#C9A96E]/20 selection:text-[#1C1917]" dir="rtl">
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
        isCollapsed ? "lg:ps-[72px]" : "lg:ps-64"
      )}>
        <AdminHeader userRole={user?.role} userName={user?.name} />
        
        <main className="flex-1 p-5 md:p-8 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
