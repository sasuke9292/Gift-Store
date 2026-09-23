import { Suspense } from "react"
import LoginClient from "./login-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تسجيل الدخول | گفتي بلس',
  description: 'تسجيل الدخول إلى حسابك في متجر گفتي بلس',
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#13213c] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginClient />
    </Suspense>
  )
}
