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
    logoUrl: settings.logoUrl
  } : {
    storeName: 'گفتي بلس | Gifty Plus',
    storeEmail: 'contact@giftstore.com',
    storePhone: '+964 770 123 4567',
    currency: 'د.ع',
    allowCod: true,
    allowOnlinePayment: false,
    orderNotifications: true,
    marketingEmails: true,
    logoUrl: null
  }

  return <SettingsClient initialSettings={initialSettings} />
}
