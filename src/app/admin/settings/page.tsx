import React from 'react'
import SettingsClient from './settings-client'
import { getStoreSettings } from '@/app/actions/admin/settings'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings()
  
  const initialSettings = settings || {
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
