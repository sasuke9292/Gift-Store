import React from 'react'
import SettingsClient from './settings-client'

export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  // We mock initial settings for now since we don't have a Settings table yet
  const initialSettings = {
    storeName: 'گفتي بلس | Gifty Plus',
    storeEmail: 'contact@giftstore.com',
    storePhone: '+964 770 123 4567',
    currency: 'د.ع',
    allowCod: true,
    allowOnlinePayment: false,
    orderNotifications: true,
    marketingEmails: true
  }

  return <SettingsClient initialSettings={initialSettings} />
}
