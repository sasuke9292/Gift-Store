import React from 'react'
import { getHeroSlides } from '@/app/actions/admin/hero-slides'
import { getStoreSettings } from '@/app/actions/admin/settings'
import HeroSlidesClient from './hero-slides-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'إدارة سلايدر الواجهة | لوحة التحكم',
  description: 'تحكم متكامل في شرائح وصور السلايدر التفاعلي على واجهة متجر گِفتي بلس'
}

export default async function AdminHeroSlidesPage() {
  const [slides, settings] = await Promise.all([
    getHeroSlides(),
    getStoreSettings()
  ])

  return (
    <React.Suspense fallback={
      <div className="max-w-6xl mx-auto p-12 text-center text-[#78716C]">
        <div className="w-8 h-8 border-2 border-[#13213c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold">جاري تحميل سلايدر الواجهة...</p>
      </div>
    }>
      <HeroSlidesClient initialSlides={slides} settings={settings} />
    </React.Suspense>
  )
}
