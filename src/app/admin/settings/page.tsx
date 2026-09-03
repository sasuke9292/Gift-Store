import React from 'react'
import SettingsClient from './settings-client'
import { getStoreSettings } from '@/app/actions/admin/settings'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings()
  
  const initialSettings = settings ? {
    storeName: settings.storeName,
    storeEmail: settings.storeEmail || '',
    storePhone: settings.storePhone || '',
    currency: settings.currency,
    allowCod: settings.allowCod,
    allowOnlinePayment: settings.allowOnlinePayment,
    orderNotifications: settings.orderNotifications,
    marketingEmails: settings.marketingEmails,
    logoUrl: settings.logoUrl,
    topBarText: settings.topBarText || '',
    heroBadge: settings.heroBadge || 'التشكيلة الجديدة كلياً لعام 2026',
    heroHeadline: settings.heroHeadline || 'لحظاتك المهمة \nتستحق الأفضل',
    heroSubheadline: settings.heroSubheadline || 'اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية لتناسب أرقى الأذواق وتخلّد أجمل الذكريات.'
  } : {
    storeName: 'گفتي بلس | Gifty Plus',
    storeEmail: 'contact@giftstore.com',
    storePhone: '+964 770 123 4567',
    currency: 'د.ع',
    allowCod: true,
    allowOnlinePayment: false,
    orderNotifications: true,
    marketingEmails: true,
    logoUrl: null,
    topBarText: '',
    heroBadge: 'التشكيلة الجديدة كلياً لعام 2026',
    heroHeadline: 'لحظاتك المهمة \nتستحق الأفضل',
    heroSubheadline: 'اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية لتناسب أرقى الأذواق وتخلّد أجمل الذكريات.'
  }

  return <SettingsClient initialSettings={initialSettings} />
}
