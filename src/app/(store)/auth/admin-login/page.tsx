import AdminLoginClient from "./admin-login-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تسجيل دخول الإدارة | گفتي بلس',
  description: 'تسجيل الدخول للوحة التحكم لفريق العمل',
}

export default function AdminLoginPage() {
  return <AdminLoginClient />
}
