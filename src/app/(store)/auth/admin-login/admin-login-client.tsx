'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft, Mail, Lock, Shield, Loader2 } from 'lucide-react'

export default function AdminLoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      loginType: 'admin',
      redirect: false,
    })

    if (result?.error) {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
    } else {
      toast.success('تم تسجيل الدخول بنجاح!')
      const session = await getSession()
      const role = session?.user?.role || 'CUSTOMER'
      router.push(role === 'CUSTOMER' ? '/' : '/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-[#13213c]/8 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 end-0 w-[400px] h-[400px] bg-[#13213c]/5 rounded-full blur-[100px] translate-y-1/2" />
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle, #13213c 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(19, 33, 60,0.3)]"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#1C1917] tracking-tight">بوابة الإدارة</h1>
          <p className="mt-2 text-[#78716C]">سجّل دخولك للوصول إلى لوحة التحكم</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_4px_30px_rgba(0,0,0,0.08)] px-8 py-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#1C1917] mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-10 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#13213c]/30 focus-visible:border-[#13213c]/50"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#1C1917] mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-10 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#13213c]/30 focus-visible:border-[#13213c]/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E8E4DF] accent-[#13213c]"
                />
                <span className="text-sm text-[#78716C]">تذكرني</span>
              </label>
              <a href="#" className="text-sm font-semibold text-[#13213c] hover:text-[#13213c] transition-colors">
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(19, 33, 60,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الدخول...
                </>
              ) : (
                'تسجيل الدخول للوحة التحكم'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8E4DF] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[#78716C] hover:text-[#13213c] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة إلى متجر العملاء
            </Link>
          </div>
        </div>

        {/* Security notice */}
        <p className="text-center text-xs text-[#A8A29E] mt-4 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#10B981]" />
          صلاحية الوصول محمية ومشفرة
        </p>
      </motion.div>
    </div>
  )
}
